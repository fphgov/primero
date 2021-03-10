import { fromJS, isImmutable } from "immutable";
import isEmpty from "lodash/isEmpty";

import { getReportingLocationConfig, getRoles, getUserGroups } from "../application/selectors";
import { displayNameHelper } from "../../libs";
import { getRecordForms } from "../record-form";

import { OPTION_TYPES, CUSTOM_LOOKUPS } from "./constants";

const referToUsers = (state, { currRecord }) =>
  state
    .getIn(["records", "transitions", "referral", "users"], fromJS([]))
    .reduce((prev, current) => {
      const userName = current.get("user_name");

      if (!isEmpty(currRecord)) {
        const currUser = currRecord.get("owned_by");

        if (currUser && currUser === userName) {
          return {};
        }
      }

      return [
        ...prev,
        {
          id: userName.toLowerCase(),
          display_text: userName
        }
      ];
    }, [])
    .filter(user => !isEmpty(user));

const lookupsList = state => state.getIn(["forms", "options", "lookups"], fromJS([]));

const formGroups = (state, i18n) =>
  state
    .getIn(["records", "admin", "forms", "formSections"], fromJS([]))
    .filter(formSection => !formSection.is_nested && formSection.form_group_id)
    .groupBy(item => item.get("form_group_id"))
    .reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.first().getIn(["form_group_id"], null),
          display_text: current.first().getIn(["form_group_name", i18n.locale], "")
        }
      ],
      []
    )
    .sortBy(item => item.display_text);

const agencies = (state, { optionStringsSourceIdKey, i18n, useUniqueId = false, filterOptions }) => {
  const stateAgencies = state.getIn(["application", "agencies"], fromJS([]));
  const filteredAgencies = filterOptions ? filterOptions(stateAgencies) : stateAgencies;

  return filteredAgencies.reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get(useUniqueId ? "unique_id" : optionStringsSourceIdKey || "id"),
        display_text: current.getIn(["name", i18n.locale], "")
      }
    ],
    []
  );
};

const locations = (state, i18n, includeAdminLevel = false) =>
  state.getIn(["forms", "options", "locations"], fromJS([])).reduce(
    (prev, current) => [
      ...prev,
      {
        id: current.get("code"),
        display_text: displayNameHelper(current.get("name"), i18n.locale),
        ...(includeAdminLevel && { admin_level: current.get("admin_level") })
      }
    ],
    []
  );

const reportingLocations = (state, i18n) =>
  locations(state, i18n, true)
    .filter(location => location.admin_level === getReportingLocationConfig(state).get("admin_level"))
    .map(location => {
      // eslint-disable-next-line camelcase
      const { id, display_text } = location;

      return {
        id,
        display_text
      };
    });

const modules = state =>
  state.getIn(["application", "modules"], fromJS([])).reduce((prev, current) => [
    ...prev,
    {
      id: current.get("unique_id"),
      display_text: current.get("name")
    }
  ]);

const lookupValues = (state, optionStringsSource, i18n) =>
  lookupsList(state)
    .find(option => option.get("unique_id") === optionStringsSource.replace(/lookup /, ""), null, fromJS({}))
    .get("values", fromJS([]))
    .reduce(
      (prev, current) => [
        ...prev,
        {
          id: current.get("id"),
          display_text: displayNameHelper(current.get("display_text"), i18n.locale)
        }
      ],
      []
    );

const filterableOptions = (filterOptions, data) => (filterOptions ? filterOptions(data) : data);

const lookups = (state, { i18n, filterOptions }) => {
  const lookupList = lookupsList(state).reduce(
    (prev, current) => [
      ...prev,
      {
        id: `lookup ${current.get("unique_id")}`,
        display_text: current.getIn(["name", i18n.locale]),
        values: current.get("values", fromJS([])).reduce(
          (valPrev, valCurrent) => [
            ...valPrev,
            {
              id: valCurrent.get("id"),
              display_text: valCurrent.getIn(["display_text", i18n.locale])
            }
          ],
          []
        )
      }
    ],
    []
  );

  return filterableOptions(filterOptions, [
    ...lookupList,
    ...(!filterableOptions
      ? CUSTOM_LOOKUPS.map(custom => ({
          id: custom,
          display_text: i18n.t(`${custom.toLowerCase()}.label`)
        })).sortBy(lookup => lookup.display_text)
      : [])
  ]);
};

const userGroups = state =>
  getUserGroups(state).reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );

const formGroupLookup = (state, { filterOptions }) =>
  filterableOptions(
    filterOptions,
    lookupsList(state).filter(lookup => lookup.get("unique_id").startsWith("lookup-form-group-"))
  );

const recordForms = (state, { filterOptions }) => {
  const formSections = getRecordForms(state, { all: true });

  return filterOptions ? filterableOptions(filterOptions, formSections) : formSections;
};

const roles = state =>
  getRoles(state).reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );

const managedRoles = (state, transfer) =>
  state.getIn(["application", "managedRoles"], fromJS([])).filter(role => role.get(transfer, false));

const buildManagedRoles = (state, transfer) =>
  managedRoles(state, transfer).reduce(
    (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
    []
  );

const optionsFromState = (state, optionStringsSource, i18n, useUniqueId, rest) => {
  switch (optionStringsSource) {
    case OPTION_TYPES.AGENCY:
      return agencies(state, { ...rest, useUniqueId, i18n });
    case OPTION_TYPES.LOCATION:
      return locations(state, i18n);
    case OPTION_TYPES.REPORTING_LOCATIONS:
      return reportingLocations(state, i18n);
    case OPTION_TYPES.MODULE:
      return modules(state);
    case OPTION_TYPES.FORM_GROUP:
      return formGroups(state, i18n);
    case OPTION_TYPES.LOOKUPS:
      return lookups(state, { i18n, ...rest });
    case OPTION_TYPES.REFER_TO_USERS:
      return referToUsers(state, { ...rest });
    case OPTION_TYPES.USER_GROUP:
      return userGroups(state);
    case OPTION_TYPES.ROLE:
      return roles(state);
    case OPTION_TYPES.ROLE_EXTERNAL_REFERRAL:
      return buildManagedRoles(state, "referral");
    case OPTION_TYPES.FORM_GROUP_LOOKUP:
      return formGroupLookup(state, { ...rest });
    case OPTION_TYPES.RECORD_FORMS:
      return recordForms(state, { ...rest });
    default:
      return lookupValues(state, optionStringsSource, i18n);
  }
};

const transformOptions = (options, i18n) => {
  const getter = (object, key) => {
    if (isImmutable(options)) {
      return object.get(key);
    }

    return object[key];
  };

  return options.reduce((prev, current) => {
    const displayText = getter(current, "display_text");

    return [
      ...prev,
      {
        ...current,
        id: getter(current, "id"),
        display_text: displayNameHelper(displayText, i18n.locale) || displayText
      }
    ];
  }, []);
};

// eslint-disable-next-line import/prefer-default-export
export const getOptions = (
  state,
  optionStringsSource,
  i18n,
  options,
  useUniqueId = false,
  rest = {
    rawOptions: false
  }
) => {
  if (optionStringsSource) {
    return optionsFromState(state, optionStringsSource, i18n, useUniqueId, rest);
  }

  if (options) {
    if (rest.rawOptions) return options;

    return Array.isArray(options) || isImmutable(options) ? transformOptions(options, i18n) : options?.[i18n.locale];
  }

  return [];
};

export const getLookupByUniqueId = (state, lookupUniqueId) =>
  lookupsList(state).find(lookup => lookup.get("unique_id") === lookupUniqueId);

export const getLoadingState = (state, path) => (path ? state.getIn(path, false) : false);

export const getValueFromOtherField = (state, fields, values) => {
  return fields.reduce((prev, current) => {
    prev.push([
      current.field,
      state
        .getIn(current.path, fromJS([]))
        .find(entity => entity[current.key] === values[current.key], null, fromJS({}))
        .get(current.key, "")
    ]);

    return prev;
  }, []);
};

export const getManagedRoleByUniqueId = (state, uniqueID) =>
  managedRoles(state, "referral").find(role => role.get("unique_id") === uniqueID, null, fromJS({}));

export const getManagedRoleFormSections = (state, uniqueID) =>
  getManagedRoleByUniqueId(state, uniqueID).get("form_section_unique_ids", fromJS([]));
