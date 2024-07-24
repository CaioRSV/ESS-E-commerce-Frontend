import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Admin } from '../fixtures/users.json';

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:8080"

const createIdFromName = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

before(() => {
  cy.intercept('GET', `${serverBaseUrl}/api/cart`, (req) => {
    req.reply({ statusCode: 200, body: [] });
  }).as("CartRequest");

  cy.window().then((win) => {
    cy.stub(win.console, 'error').callsFake((message) => {
      if (!message.includes('/api/cart')) {
        console.error(message);
      }
    });
  });
});

Given('the user is logged as admin', () => {
  cy.visit(baseUrl)
  cy.get("#navbarLoginButton").click()
  cy.get("#emailInput").type(Admin.email)
  cy.get("#senhaInput").type(Admin.senha)
  cy.get("#loginButton").click()
  cy.intercept("GET", serverBaseUrl + "/api/auth/me").as("LoggedInRequest")
  cy.wait("@LoggedInRequest")
  cy.get("#loggedInMessage").should("exist")
});

Given('the user is on the Categories page', () => {
  cy.visit(`${baseUrl}/categorias`);
});

When('the user opens the create category dialog', () => {
  cy.get('#add-category-button').click();
});

When('the user enters {string} in the category name input', (name: string) => {
  cy.get('#new-category-name-input').type(name);
});

When('the user enters {string} in the category image input', (imageUrl: string) => {
  cy.get('#new-category-image-input').type(imageUrl);
});

When('the user clicks the {string} button', (buttonText: string) => {
  cy.get('#confirm-create-category-button').click();
});

Then('a new category with name {string} should be added to the list', (name: string) => {
  cy.get(`#category-item-${createIdFromName(name)}`).should('exist');
});
