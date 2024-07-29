Feature: Create account functionality

  Scenario: Create account
    Given the user is on the authenticated modal
    And the user click in the create account button
    And the register modal is opened
    And the user insert his email
    And the user insert his name
    And the user insert his password
    When the user clicks the register button
    Then the user must be registered and see the registered name in the authenticated page and the logout button