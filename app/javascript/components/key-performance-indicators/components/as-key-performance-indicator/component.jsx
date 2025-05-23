// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Help } from "@mui/icons-material";

import OptionsBox from "../../../dashboard/options-box";
import { useI18n } from "../../../i18n";
import actionsForKPI from "../../action-creators";
import selectorsForKPI from "../../selectors";
import DateRangeSelect from "../date-range-select";
import Permission, { usePermissions, RESOURCES } from "../../../permissions";

import css from "./styles.css";

const asKeyPerformanceIndicator = (identifier, defaultData, action) => {
  return Visualizer => {
    const enhance = connect(state => ({ data: selectorsForKPI(identifier, state, defaultData) }), {
      fetchData: actionsForKPI(identifier)
    });

    return enhance(({ data, fetchData, dateRanges = [], ...props }) => {
      const i18n = useI18n();

      const canViewKpi = usePermissions(RESOURCES.kpis, [action]);

      const [currentDateRange, setCurrentDateRange] = useState(dateRanges[0]);

      useEffect(() => {
        if (canViewKpi) fetchData(currentDateRange);
      }, [currentDateRange, canViewKpi]);

      const [helptextOpen, setHelptextOpen] = useState(false);
      const handleHelptextClick = () => setHelptextOpen(!helptextOpen);

      return (
        <Permission resources={RESOURCES.kpis} actions={[action]}>
          <OptionsBox
            title={i18n.t(`key_performance_indicators.${identifier}.title`)}
            action={
              dateRanges.length > 0 && (
                <DateRangeSelect
                  i18n={i18n}
                  ranges={dateRanges}
                  selectedRange={currentDateRange}
                  setSelectedRange={setCurrentDateRange}
                  withCustomRange
                />
              )
            }
          >
            <Visualizer identifier={identifier} data={data} {...props} />
            <div>
              <div title={i18n.t(`key_performance_indicators.helptext.helptext`)} className={css.helptextHeader}>
                <Help className={css.helptextButton} onClick={handleHelptextClick} />
              </div>
              {helptextOpen && (
                <p className={css.helptextBody}>{i18n.t(`key_performance_indicators.${identifier}.helptext`)}</p>
              )}
            </div>
          </OptionsBox>
        </Permission>
      );
    });
  };
};

export default asKeyPerformanceIndicator;
