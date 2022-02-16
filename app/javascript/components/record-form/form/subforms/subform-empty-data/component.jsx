import PropTypes from "prop-types";
import ErrorIcon from "@material-ui/icons/Error";

import css from "../styles.css";
import { useI18n } from "../../../../i18n";

import { NAME } from "./constants";

const Component = ({ subformName }) => {
  const i18n = useI18n();

  return (
    <div className={css.emptySubformContainer}>
      <ErrorIcon />
      <span>
        <strong>{i18n.t("forms.subform_not_found", { subform_name: subformName })}</strong>
        {i18n.t("forms.subform_need_to_be_added")}
      </span>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  subformName: PropTypes.string
};

export default Component;
