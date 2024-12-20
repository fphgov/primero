// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import KpiTable from "../kpi-table";
import asKeyPerformanceIndicator from "../as-key-performance-indicator";
import { ACTIONS } from "../../../permissions";

function Component({ data, identifier }) {
  const i18n = useI18n();
  const columns = [
    {
      name: "reporting_site",
      label: i18n.t(`key_performance_indicators.${identifier}.reporting_site`)
    }
  ].concat(
    data
      .get("dates")
      .map(date => {
        return {
          name: date,
          // show UTC time as local time without tx conversion.
          label: i18n.toTime("key_performance_indicators.date_format", date.replace(/Z/, ""))
        };
      })
      .toJS()
  );

  const rows = data.get("data").map(row => columns.map(column => row.get(column.name)));

  return <KpiTable columns={columns} data={rows} />;
}

Component.displayName = "NumberOfIncidents";

Component.propTypes = {
  data: PropTypes.object,
  identifier: PropTypes.string
};

export default asKeyPerformanceIndicator(
  "number_of_incidents",
  { dates: [], data: [] },
  ACTIONS.KPI_NUMBER_OF_INCIDENTS
)(Component);
