# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Validate if the submitted record data an be described by the Field definitions
class RecordJsonValidatorService < JsonValidatorService
  NUMBER_VALIDATION = { 'type' => %w[integer null], 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }.freeze

  private

  # Building a schema is in inherently complex operation
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  def build_schema(fields)
    object = { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
    return object unless fields.present?

    fields.each_with_object(object) do |field, schema_hash|
      properties = schema_hash['properties']
      case field.type
      when Field::DATE_FIELD
        # Date or DateTime ISO 8601
        # Note: See deviation from JSON Schema: config/initializers/date_time_format.rb
        format = field.date_include_time ? 'date-time' : 'date'
        properties[field.name] = { 'type' => [format, 'string', 'null'], 'format' => format }
      when Field::TICK_BOX
        # Boolean
        properties[field.name] = { 'type' => %w[boolean] }
      when Field::NUMERIC_FIELD
        # Numeric, min and max are Solr limitations
        properties[field.name] = { 'type' => %w[integer null], 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }
      when Field::SELECT_BOX
        # TODO: Consider validating enums based on options
        properties[field.name] = if field.multi_select
                                   # Array of Strings
                                   { 'type' => %w[array null], 'items' => { 'type' => 'string' } }
                                 else
                                   # String
                                   { 'type' => %w[string null] }
                                 end
      when Field::RADIO_BUTTON
        properties[field.name] = { 'type' => %w[string boolean null] }
      when Field::SUBFORM
        properties[field.name] = {
          'type' => %w[array null], 'items' => with_subform_fields(
            build_schema(field.subform&.fields)
          )
        }
      when Field::TEXT_FIELD, Field::TEXT_AREA
        properties[field.name] = { 'type' => %w[string null] }
      when Field::TALLY_FIELD
        properties[field.name] = { 'type' => %w[object null], 'properties' => tally_properties(field.tally_i18n) }
      when Field::CALCULATED
        properties[field.name] = { 'type' => %w[integer number string boolean null],
                                   'minimum' => -2_147_483_648,
                                   'maximum' => 2_147_483_647 }
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/BlockLength

  def with_subform_fields(object_schema)
    object_schema.tap do |schema|
      schema['properties']['_destroy'] = { 'type' => %w[boolean null] }
      schema['properties']['unique_id'] = {
        'type' => 'string', 'format' => 'regex', 'pattern' => PermittedFieldService::UUID_REGEX
      }
    end
  end

  def tally_properties(entries)
    return {} unless entries

    entries.each_with_object({ 'total' => NUMBER_VALIDATION }) do |entry, acc|
      acc[entry['id']] = NUMBER_VALIDATION
    end
  end
end
