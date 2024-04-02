// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { OrderedMap, fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";
import { ACTIONS } from "../permissions";
import { FieldRecord, FormSectionRecord } from "../record-form/records";

import RecordActions from "./container";
import {
  REQUEST_APPROVAL_DIALOG,
  ENABLE_DISABLE_DIALOG,
  NOTES_DIALOG,
  OPEN_CLOSE_DIALOG,
  TRANSFER_DIALOG,
  EXPORT_DIALOG
} from "./constants";

describe("<RecordActions />", () => {
  const forms = {
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        visible: false,
        is_first_tab: false,
        order: 20,
        order_form_group: 110,
        parent_form: "case",
        editable: true,
        module_ids: [],
        form_group_id: "",
        form_group_name: { en: "Nested Incident Details Subform" },
        fields: [2],
        is_nested: true,
        subform_prevent_item_removal: false,
        collapsed_field_names: ["cp_incident_date", "cp_incident_violence_type"]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        is_first_tab: false,
        order: 0,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        form_group_name: { en: "Identification / Registration" },
        fields: [1],
        is_nested: false,
        subform_prevent_item_removal: false,
        collapsed_field_names: []
      }),
      3: FormSectionRecord({
        id: 3,
        unique_id: "services",
        fields: [3],
        visible: true,
        parent_form: "case",
        module_ids: ["primeromodule-cp"]
      }),
      4: FormSectionRecord({
        id: 3,
        unique_id: "services_section_subform",
        fields: [4],
        visible: true
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: 1,
        help_text: { en: "" },
        display_name: { en: "" },
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "summary_date",
        show_on_minify_form: false
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: null,
        help_text: {},
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "",
        show_on_minify_form: false
      }),
      3: FieldRecord({
        name: "services_section",
        type: "subform",
        subform_section_id: 4,
        visible: true,
        editable: true,
        disabled: false
      }),
      4: FieldRecord({
        name: "text_field_2",
        type: "text_field",
        visible: true
      })
    })
  };

  const defaultState = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "female",
            owned_by_agency_id: 1,
            record_in_scope: true,
            created_at: "2020-01-29T21:57:00.274Z",
            name: "User 1",
            alert_count: 0,
            case_id_display: "b575f47",
            owned_by: "primero_cp_ar",
            status: "open",
            registration_date: "2020-01-29",
            id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
            flag_count: 0,
            short_id: "b575f47",
            age: 15,
            workflow: "new"
          }
        ],
        filters: {
          status: ["true"]
        }
      }
    },
    user: {
      permissions: {
        cases: [ACTIONS.MANAGE, ACTIONS.EXPORT_JSON]
      }
    },
    forms
  });

  const defaultStateWithDialog = dialog =>
    defaultState.merge(
      fromJS({
        ui: {
          dialogs: {
            dialog,
            open: true
          }
        }
      })
    );

  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: fromJS({ status: "open" })
  };

  describe("Component ActionButton", () => {
    it("should render and ActionButton component", () => {
      mountedComponent(<RecordActions {...props} />, defaultState);
      expect(screen.queryAllByRole("button")).toHaveLength(1);
    });

    it("should not render and ActionButton component if there are not actions", () => {
      mountedComponent(
        <RecordActions {...props} />,
        fromJS({
          user: {
            permissions: {
              cases: ["gbv_referral_form", "record_owner"]
            }
          },
          forms
        })
      );
      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
  });

  describe("Component ToggleOpen", () => {
    it("renders ToggleOpen", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(OPEN_CLOSE_DIALOG));
      expect(screen.queryAllByRole("dialog")).toHaveLength(1);
    });
  });

  describe("Component ToggleEnable", () => {
    it("renders ToggleEnable", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(ENABLE_DISABLE_DIALOG));
      expect(screen.queryAllByRole("dialog")).toHaveLength(1);
    });
  });

  describe("Component RequestApproval", () => {
    it("renders RequestApproval", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(REQUEST_APPROVAL_DIALOG));

      expect(screen.queryAllByText(/actions.request_approval/i)).toHaveLength(1);
    });
  });

  describe("Component Transitions", () => {
    it("renders Transitions", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(TRANSFER_DIALOG));

      expect(screen.queryAllByText(/transfer.agency_label/i)).toHaveLength(2);
    });
  });

  describe("Component Notes", () => {
    it("renders Notes", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(NOTES_DIALOG));

      expect(screen.queryAllByRole("dialog")).toHaveLength(1);
    });
  });

  describe("Component Menu", () => {
    describe("when user has access to all menus", () => {
      it("renders Menu", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu")).toHaveLength(0);
      });

      it("renders MenuItem", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu-item")).toHaveLength(0);
      });

      it("renders MenuItem with Refer Cases option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
      });

      it("renders MenuItem with Add Incident option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.queryByText(/actions.incident_details_from_case/i)).toBeNull();
      });

      it("renders MenuItem with Add Services Provision option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.queryByText(/actions.services_section_from_case/i)).toBeNull();
      });

      it("renders MenuItem with Export option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
      });

      it("renders MenuItem with Create Incident option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        );
        expect(screen.getByText(/actions.incident_from_case/i)).toBeInTheDocument();
      });
    });

    describe("when user has not access to all menus", () => {
      it("renders Menu", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu")).toHaveLength(0);
      });

      it("renders MenuItem", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu-item")).toHaveLength(0);
      });

      it("renders MenuItem without Refer Cases option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        );
        expect(screen.queryByText(/buttons.referral forms.record_types.case/i)).toBeNull();
      });

      it("renders MenuItem without Export custom option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        );
        expect(screen.queryByText(/exports.custom_exports.label/i)).toBeNull();
      });

      it("renders MenuItem without Export option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        );
        expect(screen.queryByText(/cases.export/i)).toBeNull();
      });
    });

    describe("when user has read access to cases and assign_within_agency", () => {
      it("renders Menu", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ, ACTIONS.ASSIGN_WITHIN_AGENCY]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu")).toHaveLength(0);
      });

      it("renders MenuItem", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ, ACTIONS.ASSIGN_WITHIN_AGENCY]
              }
            },
            forms
          })
        );
        expect(screen.queryAllByTestId("menu-item")).toHaveLength(0);
      });

      it("renders MenuItem with the Assign Case option", () => {
        mountedComponent(
          <RecordActions {...props} />,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ, ACTIONS.ASSIGN_WITHIN_AGENCY]
              }
            },
            forms
          })
        );
        expect(screen.getByText(/buttons.reassign forms.record_types.case/i)).toBeInTheDocument(1);
      });
    });
  });

  describe("Component Exports", () => {
    it("renders Exports", () => {
      mountedComponent(<RecordActions {...props} />, defaultStateWithDialog(EXPORT_DIALOG));
      expect(screen.queryAllByRole("dialog")).toHaveLength(1);
    });

    describe("when user can only export pdf", () => {
      const state = fromJS({
        user: {
          permissions: {
            cases: [ACTIONS.READ, ACTIONS.EXPORT_PDF]
          }
        },
        forms
      });

      it("should not render <Exports /> component", () => {
        mountedComponent(<RecordActions {...props} />, state);
        expect(screen.queryAllByRole("dialog")).toHaveLength(0);
      });
    });
  });

  describe("when record is selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0] }
    };

    it.skip("renders add refer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add incident menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/actions.incident_details_from_case/i)).toBeInTheDocument();
    });

    it.skip("renders add transfer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/buttons.transfer forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add service menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/actions.services_section_from_case/i)).toBeInTheDocument();
    });

    it.skip("renders add export menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
    });
  });

  describe("when record is selected from a search, id_search: true", () => {
    const defaultStateFromSearch = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            }
          ],
          filters: {
            status: ["true"],
            id_search: true
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0] }
    };

    it.skip("renders add refer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
    });

    it("renders add reassign menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/buttons.reassign forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add transfer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/buttons.transfer forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add incident menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/actions.incident_details_from_case/i)).toBeInTheDocument();
    });

    it.skip("renders add service menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/bactions.services_section_from_case/i)).toBeInTheDocument();
    });

    it("renders add export menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateFromSearch);
      expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
    });
  });

  describe("when no record is selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: {}
    };

    it.skip("renders add refer menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add transfer menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/buttons.transfer forms.record_types.case/i)).toBeInTheDocument();
    });

    it("renders add incident menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/ctions.incident_details_from_case/i)).toBeInTheDocument();
    });

    it("renders add service menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/ctions.services_section_from_case/i)).toBeInTheDocument();
    });

    it("renders add export menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultState);
      expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
    });
  });

  describe("when many records are selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0, 1] }
    };

    const defaultStateRecordSelected = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            },
            {
              sex: "male",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-02-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "c23a5fca",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-05-02",
              id: "b342c488-578e-4f5c-85bc-35ecec23a5fca",
              flag_count: 0,
              short_id: "c23a5fca",
              age: 5,
              workflow: "new"
            }
          ],
          metadata: {
            total: 3,
            per: 20,
            page: 1
          },
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });

    it.skip("renders add refer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateRecordSelected);
      expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add transfer menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateRecordSelected);
      expect(screen.getByText(/buttons.transfer forms.record_types.case/i)).toBeInTheDocument();
    });

    it("renders add incident menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateRecordSelected);
      expect(screen.getByText(/actions.incident_details_from_case/i)).toBeInTheDocument();
    });

    it("renders add service menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateRecordSelected);
      expect(screen.getByText(/ctions.services_section_from_case/i)).toBeInTheDocument();
    });

    it("renders add export menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateRecordSelected);
      expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
    });
  });

  describe("when all the records are selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0, 1, 2] }
    };
    const defaultStateAllRecordSelected = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            },
            {
              sex: "male",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-02-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "c23a5fca",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-05-02",
              id: "b342c488-578e-4f5c-85bc-35ecec23a5fca",
              flag_count: 0,
              short_id: "c23a5fca",
              age: 5,
              workflow: "new"
            },
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-03-18T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "9C68741",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-04-18",
              id: "d861c56c-8dc9-41c9-974b-2b24299b70a2",
              flag_count: 0,
              short_id: "9C68741",
              age: 7,
              workflow: "new"
            }
          ],
          metadata: {
            total: 3,
            per: 20,
            page: 1
          },
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });

    it.skip("renders add refer menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateAllRecordSelected);
      expect(screen.getByText(/buttons.referral forms.record_types.case/i)).toBeInTheDocument();
    });

    it.skip("renders add transfer menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateAllRecordSelected);
      expect(screen.getByText(/buttons.transfer forms.record_types.case/i)).toBeInTheDocument();
    });

    it("renders add incident menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateAllRecordSelected);
      expect(screen.getByText(/actions.incident_details_from_case/i)).toBeInTheDocument();
    });

    it("renders add service menu disabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateAllRecordSelected);
      expect(screen.getByText(/ctions.services_section_from_case/i)).toBeInTheDocument();
    });

    it("renders add export menu enabled", () => {
      mountedComponent(<RecordActions {...propsRecordSelected} />, defaultStateAllRecordSelected);
      expect(screen.getByText(/cases.export/i)).toBeInTheDocument();
    });
  });

  describe("when incident subform is not presented", () => {
    const newForms = {
      formSections: OrderedMap({
        1: FormSectionRecord({
          id: 1,
          unique_id: "incident_details_container",
          name: { en: "Incident Details" },
          visible: true,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          fields: [1]
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "services",
          fields: [2],
          visible: true,
          parent_form: "case",
          module_ids: ["primeromodule-cp"]
        })
      }),
      fields: OrderedMap({
        1: FieldRecord({
          name: "incident_details",
          type: "subform",
          subform_section_id: null,
          editable: true,
          disabled: false,
          visible: true
        }),
        2: FieldRecord({
          name: "services_section",
          type: "subform",
          subform_section_id: null,
          visible: true,
          editable: true,
          disabled: false
        })
      })
    };
    const state = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              case_id_display: "b575f47",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf"
            }
          ],
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms: newForms
    });

    it("should not render AddIncident component", () => {
      mountedComponent(<RecordActions {...props} />, state);
      expect(screen.queryAllByText(/incident.messages.creation_success/i)).toHaveLength(0);
    });

    it("should not render AddService component", () => {
      mountedComponent(<RecordActions {...props} />, state);
      expect(screen.queryAllByText(/actions.services_section_from_case/i)).toHaveLength(0);
    });
  });
});
