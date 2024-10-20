// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Panel from "../../panel";
import { getOption } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import css from "../styles.css";
import {
  registerInput,
  whichOptions,
  handleMoreFiltersChange,
  resetSecondaryFilter,
  setMoreFilterOnPrimarySection
} from "../utils";
import handleFilterChange, { valueParser } from "../value-handlers";
import { useMemoizedSelector } from "../../../../../libs";

import { NAME } from "./constants";

function Component({ filter, mode, moreSectionFilters = {}, reset, setMoreSectionFilters, setReset }) {
  const i18n = useI18n();

  const { register, unregister, setValue, getValues } = useFormContext();
  const [inputValue, setInputValue] = useState([]);
  const valueRef = useRef();
  const { options, field_name: fieldName, option_strings_source: optionStringsSource } = filter;

  const setSecondaryValues = (name, values) => {
    setValue(name, values);
    setInputValue(values);
  };

  const handleReset = () => {
    setValue(fieldName, []);
    resetSecondaryFilter(mode?.secondary, fieldName, getValues()[fieldName], moreSectionFilters, setMoreSectionFilters);
  };

  useEffect(() => {
    registerInput({
      register,
      name: fieldName,
      ref: valueRef,
      defaultValue: [],
      setInputValue
    });

    setMoreFilterOnPrimarySection(moreSectionFilters, fieldName, setSecondaryValues);

    if (reset && !mode?.defaultFilter) {
      handleReset();
    }

    return () => {
      unregister(fieldName);
      if (setReset) {
        setReset(false);
      }
    };
  }, [register, unregister, fieldName]);

  const lookups = useMemoizedSelector(state => getOption(state, optionStringsSource, i18n.locale));

  const filterOptions = whichOptions({
    optionStringsSource,
    lookups,
    options,
    i18n
  });

  const handleChange = (event, value) => {
    handleFilterChange({
      type: "basic",
      event,
      value,
      setInputValue,
      inputValue,
      setValue,
      fieldName
    });

    if (mode?.secondary) {
      handleMoreFiltersChange(moreSectionFilters, setMoreSectionFilters, fieldName, getValues()[fieldName]);
    }
  };

  const renderOptions = () =>
    filterOptions.map(option => {
      const { display_name: displayName, display_text: displayText } = option;
      const optionValue = valueParser(fieldName, option.id);

      return (
        <ToggleButton
          key={`${fieldName}-${option.id}`}
          value={optionValue}
          classes={{
            root: css.toggleButton,
            selected: css.toggleButtonSelected
          }}
        >
          {displayText || displayName}
        </ToggleButton>
      );
    });

  return (
    <Panel filter={filter} getValues={getValues} handleReset={handleReset}>
      <ToggleButtonGroup
        color="primary"
        value={inputValue}
        onChange={handleChange}
        size="small"
        classes={{ root: css.toggleContainer }}
        data-testid="toggle-filter"
      >
        {renderOptions()}
      </ToggleButtonGroup>
    </Panel>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  filter: PropTypes.object.isRequired,
  mode: PropTypes.shape({
    defaultFilter: PropTypes.bool,
    secondary: PropTypes.bool
  }),
  moreSectionFilters: PropTypes.object,
  reset: PropTypes.bool,
  setMoreSectionFilters: PropTypes.func,
  setReset: PropTypes.func
};

export default Component;
