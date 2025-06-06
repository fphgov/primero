// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/display-name, react/no-multi-comp, import/prefer-default-export */
import { cx } from "@emotion/css";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { getShortIdFromUniqueId } from "../../../records";
import SubformChip from "../../../record-form/form/subforms/subform-chip";

import { SCORE_TYPES } from "./constants";

export const columns = (i18n, css, onTracingRequestClick, matchedTracesIds) => [
  {
    label: i18n.t("potential_match.tracing_request_id"),
    name: "trace.tracing_request_id",
    options: {
      customBodyRender: value => (
        <ActionButton
          id="trace.tracing_request_id"
          text={getShortIdFromUniqueId(value)}
          type={ACTION_BUTTON_TYPES.default}
          noTranslate
          variant="text"
          color="primary"
          rest={{
            onClick: () => onTracingRequestClick(value)
          }}
        />
      )
    }
  },
  {
    label: i18n.t("tracing_requests.name_of_inquirer"),
    name: "trace.relation_name"
  },
  {
    label: i18n.t("potential_match.inquiry_date"),
    name: "trace.inquiry_date"
  },
  {
    label: i18n.t("potential_match.trace"),
    name: "trace.name"
  },
  {
    label: i18n.t("potential_match.score"),
    name: "likelihood",
    options: {
      customBodyRender: value => {
        const classes = cx({ [css.likelyScore]: value });

        return <span className={classes}>{SCORE_TYPES[value]}</span>;
      }
    }
  },
  {
    label: "",
    name: "trace.id",
    options: {
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      customHeadRender: () => <th key="emptyLabel" className={css.emptyHeader} />,
      customBodyRender: value =>
        matchedTracesIds.includes(value) ? <SubformChip label={i18n.t("cases.summary.matched")} type="success" /> : ""
    }
  }
];
