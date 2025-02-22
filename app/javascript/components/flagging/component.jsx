// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import FlagIcon from "@mui/icons-material/Flag";
import PropTypes from "prop-types";
import { useState } from "react";

import useMemoizedSelector from "../../libs/use-memoized-selector";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import { useDialog } from "../action-dialog";

import { fetchFlags } from "./action-creators";
import { FlagDialog, FlagForm, ListFlags, Unflag } from "./components";
import { FLAG_DIALOG, NAME } from "./constants";
import { getSelectedFlag } from "./selectors";

function Component({ control, record, recordType }) {
  const [tab, setTab] = useState(0);
  const { dialogOpen, setDialog } = useDialog(FLAG_DIALOG);

  const isBulkFlags = Array.isArray(record);

  const selectedFlag = useMemoizedSelector(state => getSelectedFlag(state));

  const handleOpen = () => {
    setDialog({ dialog: FLAG_DIALOG, open: true });
  };

  const handleActiveTab = value => {
    setTab(value);
  };

  const flagFormProps = {
    recordType,
    record,
    handleActiveTab
  };

  const flagDialogProps = {
    isBulkFlags,
    dialogOpen,
    tab,
    setTab,
    fetchAction: fetchFlags,
    fetchArgs: [recordType, record]
  };

  const listFlagsProps = {
    recordType,
    record
  };

  return (
    <>
      {(control && <control onClick={handleOpen} />) || (
        <ActionButton
          id="record-flags"
          icon={<FlagIcon />}
          text="buttons.flags"
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: handleOpen
          }}
        />
      )}
      <FlagDialog {...flagDialogProps}>
        <div>
          <ListFlags {...listFlagsProps} />
        </div>
        <div>
          <FlagForm {...flagFormProps} />
        </div>
      </FlagDialog>
      <Unflag flag={selectedFlag} />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  control: PropTypes.node,
  record: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  showActionButtonCss: PropTypes.string
};

export default Component;
