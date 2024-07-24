import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { Customer } from '../fixtures/users.json'

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
When('O usuário está na página Carrinho', () => {
    cy.wait(200);

    cy.get('[xmlns="http://www.w3.org/2000/svg"]')
        .click();

    cy.wait(200);

    cy.get("#navbarCartButton")
        .click();

    cy.get("#goToCartButton")
        .click();

    cy.wait(500);
})
Then('O usuário deve ver a lista de produtos em seu carrinho na tela', () => {

    cy.url({timeout: 15000}).should('include', '/carrinho');

    cy.get("#productContainer")
        .children()
        .should("have.length.at.least", 1);

    cy.get("#productContainer")
        .should("contain", "Descrição");
})



Given('O usuário de email "teste@gmail.com" está logado1', () => {
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
Given('Existe um produto de ID "1" no carrinho do usuário', ()=>{
    cy.wait(200);

    cy.get('[xmlns="http://www.w3.org/2000/svg"]')
        .click();

    cy.wait(200);

    cy.get("#navbarCartButton")
        .click();

    cy.get("#goToCartButton")
        .click();

    cy.wait(500);

    cy.url({timeout: 15000}).should('include', '/carrinho');
})

When('O usuário clica no botão "Remover" correspondente ao produto de ID "1" no carrinho', ()=>{
    cy.get("#closeCartButton")
        .click();

    cy.get("#productContainer")
        .should("contain", "Produto A");
    
    cy.get("#productContainer")
        .contains("Produto A")
        .parent()
        .find("#removeButton")
        .click();
})
Then('O produto deve ser removido da lista do carrinho', () => {
    cy.get("#productContainer")
        .should("not.contain", "Produto A");
})

