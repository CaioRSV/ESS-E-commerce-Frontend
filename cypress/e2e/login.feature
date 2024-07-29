Feature: Login functionality

  Scenario: User can log in
    Given the user is on the login page
    When the user enters their email
    And the user enters their password
    And the user clicks the login button
    Then the user should be logged in successfully
