// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import NavGroup from "../nav-group";
import { useMemoizedSelector } from "../../../../../libs";
import { getRecordInformationNav } from "../../../selectors";
import { RECORD_TYPES } from "../../../../../config";

import { NAME } from "./constants";

function Component({ open, handleClick, primeroModule, selectedForm, formGroupLookup, match, recordAlerts }) {
  const { params } = match;
  const { recordType } = params;

  const recordInformationNav = useMemoizedSelector(state =>
    getRecordInformationNav(state, {
      checkVisible: true,
      recordType: RECORD_TYPES[recordType],
      primeroModule
    })
  );

  return (
    <NavGroup
      group={recordInformationNav}
      handleClick={handleClick}
      open={open}
      selectedForm={selectedForm}
      formGroupLookup={formGroupLookup}
      recordAlerts={recordAlerts}
      testID="record-information"
    />
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formGroupLookup: PropTypes.array,
  handleClick: PropTypes.func,
  match: PropTypes.object.isRequired,
  open: PropTypes.string,
  primeroModule: PropTypes.string,
  recordAlerts: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(Component);
