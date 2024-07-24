import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { Customer, Admin } from '../fixtures/users.json'

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

Given('O usuário de email "teste@gmail.com" está logado', () => {
    cy.visit(baseUrl);

    cy.get("#navbarLoginButton")
        .click();

    cy.get("#emailInput")
        .type(Customer.email);

    cy.get("#senhaInput")
        .type(Customer.senha);

    cy.wait(200);

    cy.get("#loginButton")
        .click();

    cy.intercept("GET", serverBaseUrl+"/api/auth/me").as("LoggedInRequest")

    cy.wait("@LoggedInRequest", {timeout: 20000});
        
    cy.get("#loggedInMessage")
        .should("exist") 
})
When('O usuário acessa a funcionalidade de listar pedidos', () => {
    cy.get("#pedidosCustomerButton")
        .click();
})
Then('O usuário deve ver a lista de produtos em seu carrinho na tela', () => {
    cy.get("#pedidosUserContainer")
        .should("contain", "STATUS");

    cy.get("#pedidosUserContainer")
        .children()
        .should("have.length.at.least", 1)
})
//