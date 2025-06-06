// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<ExistingFieldDialog />/components/<FieldsTable/> - Constants", () => {
  it("should have known properties", () => {
    const clonedActions = { ...constants };

    ["COLUMN_HEADERS", "NAME"].forEach(property => {
      expect(clonedActions).toHaveProperty(property);
      delete clonedActions[property];
    });

    expect(Object.keys(clonedActions)).toHaveLength(0);
  });
});
