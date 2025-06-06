// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("pages/users-form/change-password/constants.js", () => {
  describe("constants", () => {
    let clone;

    beforeAll(() => {
      clone = { ...constants };
    });

    afterAll(() => {
      expect(Object.keys(clone)).toHaveLength(0);
    });

    ["NAME", "FORM_ID"].forEach(property => {
      it(`exports '${property}'`, () => {
        expect(constants).toHaveProperty(property);
        delete clone[property];
      });
    });
  });
});
