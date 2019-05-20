module SearchFilters
  class Or < SearchFilter
    attr_accessor :filters

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        any_of do
          this.filters.each do |filter|
            #TODO: For now assume that nested filters are only Value,
            # but there is a better, functional way to solve that... later
            with(filter.field_name, filter.value)
          end
        end
      end
    end

    def to_h
      filters_hash = self.filters.present? ? self.filters.map(&:to_h) : []
      {
          type: 'or',
          filters: filters_hash
      }
    end

  end
end