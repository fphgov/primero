// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { compareDesc, parseISO } from "date-fns";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useI18n } from "../i18n";
import RecordFormTitle from "../record-form/form/record-form-title";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import RecordFormAlerts from "../record-form-alerts";

import { selectTransitions } from "./selectors";
import { TRANSITIONS_NAME } from "./constants";
import renderTransition from "./render-transition";
import css from "./styles.css";
import { fetchTransitions } from "./action-creators";

function Transitions({
  fetchable = false,
  isReferral,
  recordType,
  recordID,
  showMode,
  mobileDisplay,
  handleToggleNav
}) {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const dataTransitions = useMemoizedSelector(state => selectTransitions(state, recordType, recordID, isReferral));

  const renderDataTransitions =
    dataTransitions &&
    dataTransitions
      .sort((transitionA, transitionB) =>
        compareDesc(parseISO(transitionA.created_at), parseISO(transitionB.created_at))
      )
      .map(transition => renderTransition(transition, css, recordType, showMode));

  const transitionTitle = isReferral ? i18n.t("forms.record_types.referrals") : i18n.t("transfer_assignment.title");

  useEffect(() => {
    if (fetchable && recordID) {
      dispatch(fetchTransitions(recordType, recordID));
    }
  }, []);

  return (
    <div data-testid="transitions">
      <RecordFormTitle mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} displayText={transitionTitle} />
      <RecordFormAlerts
        form={{ unique_id: isReferral ? "referral" : "transfers_assignments" }}
        recordType={recordType}
        formMode={{ isShow: showMode }}
      />
      <div>{renderDataTransitions}</div>
    </div>
  );
}

Transitions.displayName = TRANSITIONS_NAME;

Transitions.propTypes = {
  fetchable: PropTypes.bool,
  handleToggleNav: PropTypes.func.isRequired,
  isReferral: PropTypes.bool.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  recordID: PropTypes.string.isRequired,
  recordType: PropTypes.string.isRequired,
  showMode: PropTypes.bool
};

export default Transitions;
