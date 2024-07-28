import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { Admin } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

Given('the user is on the login page', () => {
  cy.visit(baseUrl)
})

When('the user enters their email', () => {
  cy.get("#navbarLoginButton").click()
  cy.get("#emailInput").type(Admin.email)
})

When('the user enters their password', () => {
  cy.get("#senhaInput").type(Admin.senha)
})

When('the user clicks the login button', () => {
  cy.get("#loginButton").click()
  cy.intercept("GET", serverBaseUrl + "/api/auth/me").as("LoggedInRequest")
  cy.wait("@LoggedInRequest")
})

Then('the user should be logged in successfully', () => {
  cy.get("#loggedInMessage").should("exist")
})
