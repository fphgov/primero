# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a not null query parameter field_name=not_null into a sql query
class SearchFilters::NotNull < SearchFilters::SearchFilter
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(['(data->>? IS NOT NULL)', field_name])
  end

  def to_s
    return "not[#{field_name}]=not_null" unless not_filter

    "#{field_name}=not_null"
  end
end