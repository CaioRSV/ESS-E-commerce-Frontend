Feature: Login functionality

  Scenario: Change personal data
    Given the user authenticated in the system
    And the user click on the "Atualizar meus dados"
    And the user change the name
    And the user change the email
    When the user clicks the update button
    Then the user must see the updated name in the authenticated page
    And the user must see the updated email in the authenticated page