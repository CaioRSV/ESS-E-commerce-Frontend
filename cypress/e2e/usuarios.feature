Feature: Users list functionality

  Scenario: View the registered users in the system
    Given the admin is authenticated in the system
    When the admin click on the "Usuários"
    Then the admin must see the registered users in system