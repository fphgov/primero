// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { useWatch } from "react-hook-form";
import { cx } from "@emotion/css";

import { ConditionalWrapper } from "../../../libs";
import useFormField from "../use-form-field";
import useOptions from "../use-options";
import formComponent from "../utils/form-component";

import css from "./styles.css";

function WatchedFormSectionField({ checkErrors, field, formMethods, formMode, disableUnderline = false }) {
  const { control, errors, getValues } = formMethods;

  const {
    Field,
    WrapWithComponent,
    commonInputProps,
    errorsToCheck,
    handleVisibility,
    renderChildren = true,
    isNotVisible,
    metaInputProps,
    optionSelector,
    error
  } = useFormField(field, { checkErrors, errors, formMode, disableUnderline });

  const classes = cx(css.field, {
    [css.readonly]: formMode.isShow
  });

  const { watchedInputs, handleWatchedInputs, name } = field;
  const watchedInputValues = useWatch({
    control,
    name: watchedInputs
  });

  const watchedInputProps = handleWatchedInputs
    ? handleWatchedInputs(watchedInputValues, name, { error, methods: formMethods })
    : {};

  const optionSource = useOptions(optionSelector(watchedInputValues || getValues(watchedInputs)));

  const commonProps = {
    ...commonInputProps,
    ...watchedInputProps
  };

  const metaProps = {
    ...metaInputProps,
    groupBy: watchedInputProps?.groupBy || metaInputProps?.groupBy,
    watchedInputValues
  };

  if (isNotVisible(watchedInputProps)) {
    return null;
  }

  const renderField = renderChildren && (
    <Field
      field={field}
      commonInputProps={commonProps}
      metaInputProps={metaProps}
      options={optionSource}
      errorsToCheck={errorsToCheck}
      formMethods={formMethods}
      formMode={formMode}
    />
  );

  return (
    handleVisibility(watchedInputValues) || (
      <ConditionalWrapper condition={Boolean(WrapWithComponent)} wrapper={WrapWithComponent}>
        <div className={classes}>{renderField}</div>
      </ConditionalWrapper>
    )
  );
}

WatchedFormSectionField.displayName = "WatchedFormSectionField";

WatchedFormSectionField.propTypes = {
  checkErrors: PropTypes.object,
  disableUnderline: PropTypes.bool,
  field: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired
};

export default formComponent(WatchedFormSectionField);
