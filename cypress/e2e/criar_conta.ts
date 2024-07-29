import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { NewRegisterUser } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

Given('the user is on the authenticated modal', () => {
  cy.visit(baseUrl)
  cy.get("#navbarLoginButton").click()
})

When('the user click in the create account button', () => {
  cy.get("#createAccountButton").click()
})

When('the register modal is opened', () => {
  cy.get("#dialogRegisterComponent").should("exist")
})

When('the user insert his email', () => {
  const random = Math.random().toString(36).substring(3)
  cy.get("#emailRegister").type(random + NewRegisterUser.email)

  cy.intercept("POST", `${serverBaseUrl}/api/auth/email/availability`).as("CheckEmailRequest")
  cy.get("#emailRegister").blur()
  cy.wait("@CheckEmailRequest").then((interception) => {
    expect(interception?.response?.body).to.have.property("available", true)
  })
})

When('the user insert his name', () => {
  cy.get("#nameRegister").type(NewRegisterUser.name)
})

When('the user insert his password', () => {
  cy.get("#passwordRegister").type(NewRegisterUser.senha)
})

When('the user clicks the register button', () => {
  cy.intercept("POST", `${serverBaseUrl}/api/auth/register`).as("RegisterRequest")
  cy.get("#registerButton").click()
  cy.wait("@RegisterRequest")
  cy.wait(1000)
})

Then('the user must be registered and see the registered name in the authenticated page and the logout button', () => {
  cy.get("#navbarLoginButton").click()
  cy.get("#loggedInMessage").should("have.text", `Bem-vindo, ${NewRegisterUser.name}`)
  cy.get("#navbarLogoutButton").should("exist")
})
