import isEqual from "lodash/isEqual";

export default source => {
  const approvalKeys = ["approval_date", "approval_requested_for", "requested_by"];

  return (
    source.length === 1 &&
    !Object.keys(source[0]).includes("unique_id") &&
    isEqual(Object.keys(source[0]), approvalKeys)
  );
};
