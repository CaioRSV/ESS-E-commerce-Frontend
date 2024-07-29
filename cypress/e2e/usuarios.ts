import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { Admin } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

Given('the admin is authenticated in the system', () => {
  cy.visit(baseUrl)
  cy.get("#navbarLoginButton").click()

  cy.get("#emailInput").type(Admin.email)
  cy.get("#senhaInput").type(Admin.senha)
  cy.intercept("GET", serverBaseUrl + "/api/auth/me").as("LoggedInRequest")
  cy.get("#loginButton").click()
  cy.wait("@LoggedInRequest").then((interception) => {
    expect(interception?.response?.statusCode).to.be.eq(200)
  })
  cy.get("#loggedInMessage").should("exist")
})

When('the admin click on the "Usuários"', () => {
  cy.get("#usersButton").should("exist")
  cy.get("#usersButton").click()
})

Then('the admin must see the registered users in system', () => {
  cy.get("#usersTable").should("exist")
  if (cy.get("#closeModal") != null) {
    cy.get("#closeModal").click()
  }
})