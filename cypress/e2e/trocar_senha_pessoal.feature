Feature: Change password functionality

  Scenario: Change personal password
    Given the user authenticated in the system
    And the user click on the "Mudar minha senha"
    And the user input the current password
    And the user input the new password
    When the user clicks the update button
    Then the user must can log in the system using the new password