# frozen_string_literal: true

# MRM-related model
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      %i[
        individual_violations individual_age individual_sex victim_deprived_liberty_security_reasons
        reasons_deprivation_liberty victim_facilty_victims_held torture_punishment_while_deprivated_liberty
        violation_with_verification_status
      ].each { |field| string(field, multiple: true) }
    end
  end

  def individual_violations
    violations.joins(:individual_victims).pluck(Arel.sql("violations.data->>'type'")).uniq.compact
  end

  def individual_age
    individual_victims.map(&:individual_age).uniq.compact
  end

  def individual_sex
    individual_victims.map(&:individual_sex).uniq.compact
  end

  def victim_deprived_liberty_security_reasons
    individual_victims.map(&:victim_deprived_liberty_security_reasons).uniq.compact
  end

  def reasons_deprivation_liberty
    individual_victims.map(&:reasons_deprivation_liberty).uniq.compact
  end

  def victim_facilty_victims_held
    individual_victims.map(&:facilty_victims_held).uniq.compact
  end

  def torture_punishment_while_deprivated_liberty
    individual_victims.map(&:torture_punishment_while_deprivated_liberty).uniq.compact
  end

  def violation_with_verification_status
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.ctfmr_verified.present?

      memo << "#{violation.type}_#{violation.ctfmr_verified}"
    end.uniq
  end
end
