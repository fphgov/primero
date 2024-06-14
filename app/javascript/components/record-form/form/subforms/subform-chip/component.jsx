// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import clsx from "clsx";
import { Chip } from "@mui/material";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ label, type = "info", ...rest }) => {
  const classes = clsx({ [css.subformChip]: true, [css[type]]: true });

  return <Chip data-testid="chip" className={classes} label={label} {...rest} />;
};

Component.displayName = NAME;

Component.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string
};

export default Component;
