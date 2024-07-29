import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { NewRegisterUser } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

let random = Math.random().toString(36).substring(3)

Given('the user authenticated in the system', () => {
  cy.visit(baseUrl)
  cy.get("#navbarLoginButton").click()


  // Register new user 

  cy.get("#createAccountButton").click()
  cy.get("#emailRegister").type(random + NewRegisterUser.email)

  cy.intercept("POST", `${serverBaseUrl}/api/auth/email/availability`).as("CheckEmailRequest")
  cy.get("#emailRegister").blur()
  cy.wait("@CheckEmailRequest").then((interception) => {
    expect(interception?.response?.body).to.have.property("available", true)
  })
  cy.get("#nameRegister").type(NewRegisterUser.name)
  cy.get("#passwordRegister").type(NewRegisterUser.senha)
  cy.intercept("POST", `${serverBaseUrl}/api/auth/register`).as("RegisterRequest")
  cy.get("#registerButton").click()
  cy.wait("@RegisterRequest")
  cy.wait(1000)

  cy.get("#navbarLoginButton").click()
  cy.get("#navbarLogoutButton").should("exist")
})

When('the user click on the "Mudar minha senha"', () => {
  cy.get("#updatePersonalPasswordButton").should("exist")
  cy.get("#updatePersonalPasswordButton").click()
})

When('the user input the current password', () => {
  cy.get("#currentUpdatePersonalPassword").clear()
  cy.get("#currentUpdatePersonalPassword").type(NewRegisterUser.senha)
})

When('the user input the new password', () => {
  cy.get("#newUpdatePersonalPassword").clear()
  cy.get("#newUpdatePersonalPassword").type(random + NewRegisterUser.senha)
})

When('the user clicks the update button', () => {
  cy.intercept("PATCH", `${serverBaseUrl}/api/user/personal/password`).as("UpdatePersonalPasswordRequest")
  cy.get("#sendUpdatePersonalPasswordButton").click()
  cy.wait("@UpdatePersonalPasswordRequest")
})

Then('the user must can log in the system using the new password', () => {
  // Login with new password
  cy.get("#navbarLogoutButton").click()
  cy.get("#navbarLoginButton").click()
  cy.get("#emailInput").type(random + NewRegisterUser.email)
  cy.get("#senhaInput").type(random + NewRegisterUser.senha)
  cy.intercept("GET", serverBaseUrl + "/api/auth/me").as("LoggedInRequest")
  cy.get("#loginButton").click()
  cy.wait("@LoggedInRequest")

  cy.get("#loggedInMessage").should("exist")
})