// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Button, Link } from "@mui/material";

import css from "./styles.css";

function DialogTrigger({ commonInputProps, metaInputProps }) {
  const { label, id } = commonInputProps;
  const { onClick } = metaInputProps;

  return (
    <Button id={id} component={Link} color="primary" className={css.dialogTrigger} onClick={onClick}>
      {label}
    </Button>
  );
}

DialogTrigger.displayName = "DialogTrigger";

DialogTrigger.propTypes = {
  commonInputProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object
};

export default DialogTrigger;
