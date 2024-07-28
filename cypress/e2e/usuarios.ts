import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { Admin } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

let random = Math.random().toString(36).substring(3)

Given('the admin is authenticated in the system', () => {
  cy.visit(baseUrl)
  cy.get("#navbarLoginButton").click()

  // Already logged in
  cy.get('body').then(($body) => {
    if ($body.find("#loggedInMessage").length > 0 && $body.find("#loggedInMessage").is(':visible')) {
      // Usuário está logado, então faz logout
      cy.get("#navbarLogoutButton").click()
      cy.get("#navbarLoginButton").click()
    }
  })

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