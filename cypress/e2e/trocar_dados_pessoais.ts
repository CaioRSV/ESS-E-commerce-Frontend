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
  cy.wait("@CheckEmailRequest", { timeout: 20000 }).then((interception) => {
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

When('the user click on the "Atualizar meus dados"', () => {
  cy.get("#updatePersonalDataButton").should("exist")
  cy.get("#updatePersonalDataButton").click()
})

When('the user change the name', () => {
  cy.get("#nameUpdatePersonalData").clear()
  cy.get("#nameUpdatePersonalData").type((random+random) + NewRegisterUser.name)
})

When('the user change the email', () => {
  cy.get("#emailUpdatePersonalData").clear()
  cy.get("#emailUpdatePersonalData").type((random+random) + NewRegisterUser.email)
})

When('the user clicks the update button', () => {
  cy.intercept("PATCH", `${serverBaseUrl}/api/user/personal/data`).as("UpdatePersonalDataRequest")
  cy.get("#sendUpdatePersonalDataButton").click()
  cy.wait("@UpdatePersonalDataRequest")
})

When('the user must see the updated name in the authenticated page', () => {
  cy.get("#loggedInMessage").should("have.text", `Bem-vindo, ${(random+random) + NewRegisterUser.name}`)
})

When('the user must see the updated email in the authenticated page', () => {
  cy.get("#loggedInEmail").should("have.text", `${(random+random) + NewRegisterUser.email}`)
})