import {Admin} from "../fixtures/users.json"

describe('Teste', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000/");
    })
    it("Usuário consegue se logar", () => {
        
    cy.get("#navbarLoginButton")
    .click();

    cy.get("#emailInput")
        .type(Admin.email);

    cy.get("#senhaInput")
        .type(Admin.senha);

    cy.get("#loginButton")
        .click();

    cy.intercept("GET", "http://localhost:3333/api/auth/me").as("LoggedInRequest")

    cy.wait("@LoggedInRequest");
        
    cy.get("#loggedInMessage")
        .should("exist")
    })
})