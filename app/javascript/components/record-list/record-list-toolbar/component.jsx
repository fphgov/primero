// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import { PageHeading } from "../../page";
import RecordActions from "../../record-actions";
import Permission, { CREATE_RECORDS } from "../../permissions";
import AddRecordMenu from "../add-record-menu";
import { useDrawer } from "../../drawer";
import { FILTER_DRAWER } from "../components/filter-container/constants";
import { SORT_DRAWER } from "../components/sort-container/constants";

import { NAME } from "./constants";

const mode = { isShow: true };

const Component = ({ title, recordType, selectedRecords, currentPage, clearSelectedRecords }) => {
  const { toggleDrawer: toggleFilterDrawer } = useDrawer(FILTER_DRAWER);
  const { toggleDrawer: toggleSortDrawer } = useDrawer(SORT_DRAWER);

  return (
    <PageHeading title={title}>
      <Box sx={{ display: { md: "none", xs: "block" } }}>
        <IconButton size="large" onClick={toggleSortDrawer} color="primary">
          <ImportExportIcon />
        </IconButton>
        <IconButton size="large" onClick={toggleFilterDrawer} color="primary">
          <FilterListIcon />
        </IconButton>
      </Box>
      <Permission resources={recordType} actions={CREATE_RECORDS}>
        <AddRecordMenu recordType={recordType} />
      </Permission>
      <RecordActions
        currentPage={currentPage}
        clearSelectedRecords={clearSelectedRecords}
        selectedRecords={selectedRecords}
        recordType={recordType}
        mode={mode}
        showListActions
      />
    </PageHeading>
  );
};

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  currentPage: PropTypes.number,
  recordType: PropTypes.string.isRequired,
  selectedRecords: PropTypes.object,
  title: PropTypes.string.isRequired
};

Component.displayName = NAME;

Component.whyDidYouRender = true;

export default Component;
