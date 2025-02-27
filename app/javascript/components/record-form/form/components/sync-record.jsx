// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable jsx-a11y/anchor-is-valid */
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { externalSync, fetchRecord } from "../../../records/action-creators";

import { SYNC_RECORD_NAME, SYNC_RECORD_STATUS } from "./constants";
import { buildLabelSync } from "./utils";
import css from "./styles.css";

function SyncRecord({ i18n, isEnabledWebhookSyncFor, syncedAt, syncStatus, params }) {
  const dispatch = useDispatch();

  if (!isEnabledWebhookSyncFor) {
    return null;
  }

  const labelSyncRecord = buildLabelSync(syncStatus, syncedAt, i18n);
  const isSendingOrSent = [SYNC_RECORD_STATUS.sending, SYNC_RECORD_STATUS.sent].includes(syncStatus);
  const disabled = isSendingOrSent ? { disabled: true } : {};

  const handleImport = () => {
    dispatch(externalSync(params.recordType, params.id));
  };

  const handleCheckStatus = () => {
    dispatch(fetchRecord(params.recordType, params.id));
  };

  const renderSyncBtn = (
    <ActionButton
      text="buttons.sync"
      type={ACTION_BUTTON_TYPES.default}
      outlined
      rest={{
        size: "small",
        onClick: handleImport,
        ...disabled
      }}
    />
  );

  const renderCheckStatusBtn = isSendingOrSent && (
    <div className={css.checkStatusClass}>
      <Link component="button" variant="body2" onClick={handleCheckStatus} className={css.bntSyncClass}>
        <div className={css.checkStatusLabelClass}>
          <RefreshIcon />
          <div>{i18n.t("buttons.check_status")}</div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className={css.importDataClass}>
      <span className={css.importDataLabelClass}>{labelSyncRecord}</span>
      {renderSyncBtn}
      {renderCheckStatusBtn}
    </div>
  );
}

SyncRecord.displayName = SYNC_RECORD_NAME;

SyncRecord.propTypes = {
  i18n: PropTypes.shape({
    l: PropTypes.func,
    t: PropTypes.func
  }),
  isEnabledWebhookSyncFor: PropTypes.bool,
  params: PropTypes.object.isRequired,
  syncedAt: PropTypes.string,
  syncStatus: PropTypes.string
};

export default SyncRecord;
