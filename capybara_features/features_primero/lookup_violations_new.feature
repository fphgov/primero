#JIRA PRIMERO-315

@javascript @primero
Feature: Lookup Violations New
  As a User I want to be able to associate different entities with one or more violations when creating a new incident

  Background:
    Given I am logged in as an admin with username "primero" and password "primero"
    When I access "incidents page"
    And I press the "Create a New Incident" button

  Scenario: As a logged in user, if the current incident has no violations, the violations select should be empty
    And I press the "Individual Details" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
      
  Scenario: As a logged in user, if I add a violation, before reload, the violations select should be empty
    And I press the "Violations" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
    And I press the "Individual Details" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | NONE                      | no        |
      
  Scenario: As a logged in user, if I add a violation, after reload, the violations select should contain the violation
    And I press the "Violations" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
    And I press the "Reload Violations" button
    And I press the "Individual Details" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      
  Scenario: As a logged in user, if I add multiple violations, after reload, the violations select should contain those violations
    And I press the "Violations" button
    And I press the "Maiming" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
    And I press the "Recruitment" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
    And I press the "Abduction" button
    And I fill in the following:
      | Number of survivors: boys    | 1 |
    And I press the "Reload Violations" button
    And I press the "Individual Details" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      | recruitment_0             | no        |
      | abduction_0               | no        |
    And I press the "Group Details" button
    And I add a "Group Details Section" subform
    Then the "Violations" select box in the 1st "Group Details Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      | recruitment_0             | no        |
      | abduction_0               | no        |
    And I press the "Source" button
    And I add a "Source Subform Section" subform
    Then the "Violations" select box in the 1st "Source Subform Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      | recruitment_0             | no        |
      | abduction_0               | no        |
    And I press the "Perpetrator" button
    And I add a "Perpetrator Subform Section" subform
    Then the "Violations" select box in the 1st "Perpetrator Subform Section" subform should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      | recruitment_0             | no        |
      | abduction_0               | no        |
    And I press the "Intervention" button
    Then the "Violations" select box should have the following options:
      | label                     | selected? |
      | maiming_0                 | no        |
      | recruitment_0             | no        |
      | abduction_0               | no        |