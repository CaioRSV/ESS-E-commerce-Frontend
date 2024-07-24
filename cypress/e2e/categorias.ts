import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Admin } from '../fixtures/users.json';
import { json } from 'stream/consumers';

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:8080"

let categoryId: number;

beforeEach(() => {
  cy.intercept('GET', `${serverBaseUrl}/api/cart`, (req) => {
    req.reply({ statusCode: 200, body: [] });
  }).as("CartRequest");
});

Given('the user is logged as admin', () => {
  cy.visit(baseUrl);
  cy.get("#navbarLoginButton").click();
  cy.get("#emailInput").type(Admin.email);
  cy.get("#senhaInput").type(Admin.senha);
  cy.get("#loginButton").click();
  cy.intercept("GET", `${serverBaseUrl}/api/auth/me`).as("LoggedInRequest");
  cy.wait("@LoggedInRequest");
  cy.get("#loggedInMessage").should("exist");
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

When('the user clicks the create button', () => {
  cy.intercept("POST", `${serverBaseUrl}/api/categories`).as("CreateCategoryRequest");
  cy.get('#confirm-create-category-button').click();
  cy.wait("@CreateCategoryRequest").then((interception) => {
    if (interception.response) {
      const responseBody = interception.response.body;
      categoryId = responseBody.id;
    }
  });
});

Then('a new category with name {string} should be added to the list', (name: string) => {
  cy.get(`#category-item-${categoryId}`).should('exist').contains(name);
});

Given('a category with name {string} exists', (name: string) => {
  cy.get(`#category-item-${categoryId}`).should('exist').contains(name);
});

When('the user opens the edit dialog for the category named {string}', (name: string) => {
  cy.get(`#category-item-${categoryId} .edit`).click();
});

When('the user changes the category name to {string}', (newName: string) => {
  cy.get('#edit-category-name-input').clear().type(newName);
});

When('the user changes the category image to {string}', (newImageUrl: string) => {
  cy.get('#edit-category-image-input').clear().type(newImageUrl);
});

When('the user clicks the update button', () => {
  cy.get('#confirm-edit-category-button').click();
});

Then('the category name should be updated to {string}', (updatedName: string) => {
  cy.get(`#category-item-${categoryId}`).should('exist').contains(updatedName);
});