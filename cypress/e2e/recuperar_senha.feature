Feature: Login functionality

  Scenario: User recovery password
    Given the user is on the login page
    And the user open the authentication page
    When the user click in the recovery password button
    And the user insert his email
    And the user clicks the send button
    Then the user must see the message "Se um usuário com este email existir, um link de redefinição de senha será enviado."
