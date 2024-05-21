# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @configurations do |configuration|
    json.partial! 'api/v2/primero_configurations/configuration', configuration:
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
