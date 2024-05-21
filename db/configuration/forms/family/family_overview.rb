# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

family_overview_fields = [
  Field.new(name: 'family_id',
            type: 'text_field',
            editable: false,
            disabled: true,
            display_name_en: 'Long ID',
            mobile_visible: false,
            visible: false),
  Field.new(name: 'short_id',
            type: 'text_field',
            editable: false,
            disabled: true,
            display_name_en: 'Short ID',
            mobile_visible: false,
            visible: false),
  Field.new(name: 'family_id_display',
            type: 'text_field',
            editable: false,
            disabled: true,
            display_name_en: 'Family ID'),
  Field.new(name: 'status',
            type: 'select_box',
            selected_value: Record::STATUS_OPEN,
            display_name_en: 'Record Status',
            option_strings_source: 'lookup lookup-case-status',
            editable: false,
            disabled: true),
  Field.new(name: 'family_registration_date',
            type: 'date_field',
            selected_value: 'today',
            required: false,
            display_name_en: 'Registration Date',
            date_validation: 'not_future_date',
            help_text_en: 'Date the Family record was created.'),
  Field.new(name: 'family_type',
            type: 'select_box',
            required: true,
            display_name_en: 'Family Type',
            option_strings_source: 'lookup lookup-family-type',
            visible: false),
  Field.new(name: 'family_name',
            type: 'text_field',
            display_name_en: 'Family Name',
            required: false,
            matchable: true),
  Field.new(name: 'family_number',
            type: 'text_field',
            display_name_en: 'Family Number',
            required: false,
            matchable: true),
  Field.new(name: 'family_nationality',
            type: 'select_box',
            multi_select: true,
            display_name_en: 'Nationality',
            option_strings_source: 'lookup lookup-country',
            matchable: true),
  Field.new(name: 'family_ethnicity',
            type: 'select_box',
            multi_select: true,
            display_name_en: 'Ethnicity/Clan/Tribe',
            option_strings_source: 'lookup lookup-ethnicity',
            matchable: true),
  Field.new(name: 'family_language',
            type: 'select_box',
            multi_select: true,
            display_name_en: 'Languages spoken',
            option_strings_source: 'lookup lookup-language'),
  Field.new(name: 'family_address_current',
            type: 'textarea',
            required: false,
            display_name_en: 'Family Address'),
  Field.new(name: 'family_landmark_current',
            type: 'text_field',
            display_name_en: 'Family Landmark',
            visible: false),
  Field.new(name: 'family_location_current',
            type: 'select_box',
            display_name_en: 'Family Location',
            option_strings_source: 'Location'),
  Field.new(name: 'family_telephone_current',
            type: 'text_field',
            display_name_en: 'Family Telephone'),
  Field.new(name: 'family_location_notes',
            type: 'text_field',
            display_name_en: 'Notes on the Family Location and Telephone',
            help_text_en: 'Note here if the family has multiple addresses and / or multiple telephone numbers '\
                          'that should be used.')
]

FormSection.create_or_update!(
  unique_id: 'family_overview',
  parent_form: 'family',
  visible: true,
  order_form_group: 30,
  order: 10,
  order_subform: 0,
  form_group_id: 'family_overview',
  editable: true,
  fields: family_overview_fields,
  is_first_tab: true,
  name_en: 'Family Overview',
  description_en: 'Basic information about a family.',
  mobile_form: true,
  header_message_link: 'workflow_status'
)
