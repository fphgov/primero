require 'rails_helper'

describe ManagedReports::Indicators::IncidentTimeofday do
  before do
    clean_data(Incident, UserGroup, User, Agency, Role)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::VIOLATION_REPORT
        ]
      )
    ]
    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: permissions
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions: permissions
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions: permissions
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions: permissions
    )

    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
    agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2')

    group_a = UserGroup.create(unique_id: 'group-a', name: 'Group A')
    group_b = UserGroup.create(unique_id: 'group-b', name: 'Group B')

    @self_user = User.create!(
      full_name: 'Self User',
      user_name: 'self_user',
      email: 'self_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a],
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: agency_role
    )

    @all_user = User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      role: all_role
    )

    Incident.new_with_user(
      @self_user,
      { incident_date: Date.new(2020, 8, 12), incident_timeofday: 'morning' }
    ).save!
    Incident.new_with_user(
      @group_user,
      { incident_date: Date.new(2021, 9, 8), incident_timeofday: 'afternoon' }
    ).save!
    Incident.new_with_user(
      @agency_user,
      { incident_date: Date.new(2021, 9, 10), incident_timeofday: 'evening_night' }
    ).save!
    Incident.new_with_user(
      @all_user,
      { incident_date: Date.new(2020, 9, 12), incident_timeofday: 'afternoon' }
    ).save!
    Incident.new_with_user(
      @all_user,
      { incident_date: Date.new(2022, 10, 8), incident_timeofday: 'unknown' }
    ).save!
  end

  it 'returns the number of incidents grouped by incident_timeofday' do
    data = ManagedReports::Indicators::IncidentTimeofday.build.data

    expect(data).to match_array(
      [
        { 'id' => 'morning', 'total' => 1 },
        { 'id' => 'evening_night', 'total' => 1 },
        { 'id' => 'unknown', 'total' => 1 },
        { 'id' => 'afternoon', 'total' => 2 }
      ]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      data = ManagedReports::Indicators::IncidentTimeofday.build(@self_user).data

      expect(data).to match_array(
        [
          { 'id' => 'morning', 'total' => 1 }
        ]
      )
    end

    it 'returns group records for a group scope' do
      data = ManagedReports::Indicators::IncidentTimeofday.build(@group_user).data

      expect(data).to match_array(
        [
          { 'id' => 'evening_night', 'total' => 1 },
          { 'id' => 'unknown', 'total' => 1 },
          { 'id' => 'afternoon', 'total' => 2 }
        ]
      )
    end

    it 'returns agency records for an agency scope' do
      data = ManagedReports::Indicators::IncidentTimeofday.build(@agency_user).data

      expect(data).to match_array(
        [
          { 'id' => 'evening_night', 'total' => 1 },
          { 'id' => 'afternoon', 'total' => 1 }
        ]
      )
    end

    it 'returns all records for an all scope' do
      data = ManagedReports::Indicators::IncidentTimeofday.build(@all_user).data

      expect(data).to match_array(
        [
          { 'id' => 'morning', 'total' => 1 },
          { 'id' => 'evening_night', 'total' => 1 },
          { 'id' => 'unknown', 'total' => 1 },
          { 'id' => 'afternoon', 'total' => 2 }
        ]
      )
    end
  end

  describe 'grouped by' do
    context 'when is year' do
      it 'should return results grouped by year' do
        data = ManagedReports::Indicators::IncidentTimeofday.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'year'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              'data' => [
                { 'id' => 'afternoon', 'total' => 1 },
                { 'id' => 'morning', 'total' => 1 }
              ],
              'group_id' => 2020
            },
            {
              'data' => [
                { 'id' => 'afternoon', 'total' => 1 },
                { 'id' => 'evening_night', 'total' => 1 }
              ],
              'group_id' => 2021
            },
            { 'data' => [{ 'id' => 'unknown', 'total' => 1 }], 'group_id' => 2022 }
          ]
        )
      end
    end

    context 'when is month' do
      it 'should return results grouped by month' do
        data = ManagedReports::Indicators::IncidentTimeofday.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'month'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            { 'data' => [{ 'id' => 'morning', 'total' => 1 }], 'group_id' => '2020-08' },
            { 'data' => [{ 'id' => 'afternoon', 'total' => 1 }], 'group_id' => 'september-2020' },
            {
              'data' => [
                { 'id' => 'afternoon', 'total' => 1 },
                { 'id' => 'evening_night', 'total' => 1 }
              ],
              'group_id' => 'september-2021'
            },
            { 'data' => [{ 'id' => 'unknown', 'total' => 1 }], 'group_id' => 'october-2022' }
          ]
        )
      end
    end

    context 'when is quarter' do
      it 'should return results grouped by quarter' do
        data = ManagedReports::Indicators::IncidentTimeofday.build(
          nil,
          {
            'grouped_by' => SearchFilters::Value.new(field_name: 'grouped_by', value: 'quarter'),
            'incident_date' => SearchFilters::DateRange.new(
              field_name: 'incident_date',
              from: '2020-08-01',
              to: '2022-10-10'
            )
          }
        ).data

        expect(data).to match_array(
          [
            {
              'data' => [
                { 'id' => 'afternoon', 'total' => 1 },
                { 'id' => 'morning', 'total' => 1 }
              ],
              'group_id' => '2020-Q3'
            },
            {
              'data' => [
                { 'id' => 'afternoon', 'total' => 1 },
                { 'id' => 'evening_night', 'total' => 1 }
              ],
              'group_id' => '2021-Q3'
            },
            { 'data' => [{ 'id' => 'unknown', 'total' => 1 }], 'group_id' => 'q4-2022' }
          ]
        )
      end
    end
  end
end
