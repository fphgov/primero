// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import last from "lodash/last";

import { LOCALE_KEYS } from "../../../../config";
import { dataToJS } from "../../../../libs";
import { INDICATOR_NAMES } from "../constants";

import defaultBodyRender from "./default-body-render";

const reportingLocationLabel = (reportingLocationConfig, i18n) => {
  const locationTypes = [];

  reportingLocationConfig.label_keys.forEach(key => {
    locationTypes.push(`${i18n.t(`location.base_types.${key}`)}`);
  });

  return `${locationTypes.join(", ")}`;
};

export const dashboardTableData = (optionsByIndex, data, indicators, listKey) => {
  const rows = indicators.reduce((acc, indicator) => {
    const indicatorData = data[indicator];

    Object.keys(indicatorData).forEach(key => {
      const optionLabel = optionsByIndex[key.toLowerCase()] || optionsByIndex[key.toUpperCase()] || key;

      if (key) {
        const listKeyValue = { [indicator]: indicatorData[key][listKey] };
        const optionLabelValue = { "": optionLabel };

        acc[key] = acc[key] ? { ...acc[key], ...listKeyValue } : { ...optionLabelValue, ...listKeyValue };
      }
    });

    return acc;
  }, {});

  return Object.keys(rows).map(key => rows[key]);
};

export default (data, reportingLocationConfig, i18n, locations) => {
  const options = { customBodyRender: defaultBodyRender };
  const columns = [
    { name: "", label: reportingLocationLabel(dataToJS(reportingLocationConfig), i18n) },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN,
      label: i18n.t("dashboard.open_cases"),
      options
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN_LAST_WEEK,
      label: i18n.t("dashboard.new_last_week"),
      options
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_OPEN_THIS_WEEK,
      label: i18n.t("dashboard.new_this_week"),
      options
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_LAST_WEEK,
      label: i18n.t("dashboard.closed_last_week"),
      options
    },
    {
      name: INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_THIS_WEEK,
      label: i18n.t("dashboard.closed_this_week"),
      options
    }
  ];

  const indicators = [
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_OPEN_THIS_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_LAST_WEEK,
    INDICATOR_NAMES.REPORTING_LOCATION_ClOSED_THIS_WEEK
  ];

  const locationsByCode = {};

  locations.forEach(location => {
    const locationFallback = location.getIn(["name", LOCALE_KEYS.en], "");

    locationsByCode[location.get("code")] = last(location.getIn(["name", i18n.locale], locationFallback).split(":"));
  });

  const result = dataToJS(data);

  if (result.length || Object.keys(result).length) {
    const countValues = dashboardTableData(locationsByCode, result.indicators, indicators, "count");

    const queryValues = dashboardTableData(locationsByCode, result.indicators, indicators, "query");

    return {
      columns,
      data: countValues,
      query: queryValues
    };
  }

  return {
    columns,
    data: [],
    query: []
  };
};
