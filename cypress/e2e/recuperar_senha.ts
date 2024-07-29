import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { NewRegisterUser } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

Given('the user is on the login page', () => {
  cy.visit(baseUrl)
})

When('the user open the authentication page', () => {
  cy.get("#navbarLoginButton").click()
})

When('the user click in the recovery password button', () => {
  cy.get("#forgetPasswordButton").click()
})

When('the user insert his email', () => {
  cy.get("#emailForget").type('-@gmail.com')
})

When('the user clicks the send button', () => {
  cy.intercept("POST", `${serverBaseUrl}/api/auth/forgot/password`).as("RecoveryPasswordRequest")
  cy.get("#forgetPasswordSendButton").click()
  cy.wait("@RecoveryPasswordRequest")
})

Then('the user must see the message "Se um usuário com este email existir, um link de redefinição de senha será enviado."', () => {
  cy.get("#recoveryPasswordMessageSuccess").should("exist")
  cy.get("#recoveryPasswordMessageSuccess").should("have.text", "Se um usuário com este email existir, um link de redefinição de senha será enviado.")
})
