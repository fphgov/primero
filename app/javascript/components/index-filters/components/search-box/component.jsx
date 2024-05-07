// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IconButton, InputBase, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import ActionButton from "../../../action-button";
import { useI18n } from "../../../i18n";
import SearchNameToggle from "../search-name-toggle";
import { registerInput } from "../filter-types/utils";
import handleFilterChange from "../filter-types/value-handlers";
import PhoneticHelpText from "../phonetic-help-text";

import css from "./styles.css";
import { searchTitleI18nKey } from "./utils";

const FIELD_NAME_QUERY = "query";
const FIELD_NAME_ID_SEARCH = "id_search";
const FIELD_NAME_PHONETIC = "phonetic";

function SearchBox() {
  const i18n = useI18n();

  const { register, unregister, setValue } = useFormContext();
  const watchPhonetic = useWatch({ name: FIELD_NAME_PHONETIC, defaultValue: false });
  const searchTitle = i18n.t(searchTitleI18nKey(watchPhonetic));
  const [inputValue, setInputValue] = useState();
  const [switchValue, setSwitchValue] = useState();
  const valueRef = useRef();
  const switchRef = useRef();

  useEffect(() => {
    registerInput({
      register,
      name: FIELD_NAME_QUERY,
      defaultValue: "",
      ref: valueRef,
      setInputValue
    });
    register({ name: FIELD_NAME_ID_SEARCH });
    registerInput({
      register,
      name: FIELD_NAME_PHONETIC,
      defaultValue: false,
      ref: switchRef,
      setInputValue: setSwitchValue
    });

    return () => {
      unregister(FIELD_NAME_QUERY);
      unregister(FIELD_NAME_ID_SEARCH);
      unregister(FIELD_NAME_PHONETIC);
    };
  }, [register, unregister]);

  const handleChange = event => {
    const { value } = event.target;

    handleFilterChange({
      type: "basic",
      event,
      value: event.target.value,
      setInputValue,
      inputValue,
      setValue,
      fieldName: FIELD_NAME_QUERY
    });

    setValue(FIELD_NAME_ID_SEARCH, !!value);
  };

  const handleSwitchChange = event => {
    handleFilterChange({
      type: "basic",
      event,
      value: event.target.checked,
      setInputValue: setSwitchValue,
      inputValue: switchValue,
      setValue,
      fieldName: FIELD_NAME_PHONETIC
    });
  };

  const handleClear = () => {
    setValue(FIELD_NAME_QUERY, undefined);
  };

  return (
    <div className={css.searchContainer}>
      <p className={css.searchTitle}>{searchTitle}</p>
      <div className={css.searchInputContainer}>
        <InputBase
          id="search-input"
          className={css.searchInput}
          placeholder={i18n.t("navigation.search")}
          onKeyUp={handleChange}
          onChange={handleChange}
          value={inputValue}
          inputProps={{ "aria-label": i18n.t("navigation.search") }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton className={css.iconSearchButton} onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      <div className={css.searchActions}>
        <SearchNameToggle handleChange={handleSwitchChange} value={switchValue} />
        <ActionButton
          icon={<SearchIcon />}
          text="navigation.search"
          type={ACTION_BUTTON_TYPES.default}
          rest={{ type: "submit" }}
        />
      </div>
      {watchPhonetic && <PhoneticHelpText />}
    </div>
  );
}

SearchBox.displayName = "Search";

export default SearchBox;
