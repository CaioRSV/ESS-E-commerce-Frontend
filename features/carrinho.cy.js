import { Customer } from "../../../fixtures/users.json"
import { Given, When, Then} from "cypress-cucumber-preprocessor/steps";

Given(`O usuário de email "teste@gmail.com" está logado`, () => {
    cy.visit(Cypress.env("BASE_URL"));

    cy.get("#navbarLoginButton")
        .click();
})
When(`O usuário está na página Carrinho`, () => {
    cy.log("OSHEM")
})
Then(`O usuário deve ver a lista de produtos em seu carrinho na tela`, () => {
    cy.log('NOJEEENTO')
})