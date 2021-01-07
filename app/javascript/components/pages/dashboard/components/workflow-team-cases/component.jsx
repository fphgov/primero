import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getWorkflowTeamCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import { toListTable } from "../../utils";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, DashboardTable } from "../../../../dashboard";
import { MODULES, RECORD_TYPES, ROUTES } from "../../../../../config";
import { selectModule } from "../../../../application";

import { NAME } from "./constants";

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const workflowLabels = useSelector(
    state => selectModule(state, MODULES.CP)?.workflows?.[RECORD_TYPES.cases]?.[i18n.locale]
  );

  const casesWorkflowTeam = useSelector(state => getWorkflowTeamCases(state));

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW_TEAM}>
      <OptionsBox
        title={i18n.t("dashboard.workflow_team")}
        hasData={Boolean(casesWorkflowTeam.size)}
        {...loadingIndicator}
      >
        <DashboardTable
          pathname={ROUTES.cases}
          title={i18n.t("dashboard.workflow_team")}
          {...toListTable(casesWorkflowTeam, workflowLabels)}
        />
      </OptionsBox>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
