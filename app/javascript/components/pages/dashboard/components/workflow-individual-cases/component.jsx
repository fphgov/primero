// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { getWorkflowIndividualCases } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox } from "../../../../dashboard";
import { RECORD_TYPES } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import css from "../styles.css";
import { getAllWorkflowLabels } from "../../../../application/selectors";

import { NAME, CLOSED } from "./constants";
import WorkFlowStep from "./components";

function Component({ loadingIndicator }) {
  const i18n = useI18n();

  const workflowLabels = useMemoizedSelector(state => getAllWorkflowLabels(state, RECORD_TYPES.cases));
  const casesWorkflow = useMemoizedSelector(state => getWorkflowIndividualCases(state));

  const renderSteps = workflow =>
    workflow
      .filter(step => step.id !== CLOSED)
      .map(step => {
        return <WorkFlowStep step={step} casesWorkflow={casesWorkflow} i18n={i18n} key={step.id} />;
      });

  return (
    <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_WORKFLOW}>
      {workflowLabels.map(([name, workflow]) => (
        <OptionsBox
          title={`${i18n.t("dashboard.workflow")} - ${name}`}
          hasData={Boolean(casesWorkflow.size)}
          {...loadingIndicator}
        >
          <div className={css.container}>{renderSteps(workflow)}</div>
        </OptionsBox>
      ))}
    </Permission>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
