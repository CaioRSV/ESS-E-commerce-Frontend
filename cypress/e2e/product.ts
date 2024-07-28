import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Admin } from '../fixtures/users.json';

const baseUrl = "http://localhost:3000"
const serverBaseUrl = "http://localhost:3333"

let itemId: number;


Given('O usuário está logado como admin', () => {
  cy.visit(baseUrl);
  cy.get("#navbarLoginButton").click();
  cy.get("#emailInput").type(Admin.email);
  cy.get("#senhaInput").type(Admin.senha);
  cy.get("#loginButton").click();
  cy.intercept("GET", `${serverBaseUrl}/api/auth/me`).as("LoggedInRequest");
  cy.wait("@LoggedInRequest");
  cy.get("#loggedInMessage").should("exist");
});

Given('O usuário está na página principal', () => {
  cy.visit(`${baseUrl}/`);
});

Then('O usuário deve ver a lista de produtos na tela', () => {
  cy.get('#product-list').should('exist');
});

Given('O usuário está na página de administração de produtos', () => {
  cy.visit(`${baseUrl}/admin/product`);
});

When('O usuário insere {string} na caixa de input "Nome da peça"', (name: string) => {
  cy.get('#item-name-input').type(name);
});

When('O usuário insere {string} na caixa de input "Imagem da peça"', (imageUrl: string) => {
  cy.get('#item-image-input').type(imageUrl);
});

When('O usuário insere {string} na caixa de input "Preço"', (price: string) => {
  cy.get('#item-price-input').type(price);
});

When('O usuário insere {string} na caixa de input "Estoque"', (stock: string) => {
  cy.get('#item-stock-input').type(stock);
});

When('O usuário seleciona {string} na caixa de seleção da "Categoria"', (category: string) => {
  cy.get('#item-category-select').select(category);
});

When('O usuário insere {string} na caixa de input "Descrição"', (description: string) => {
  cy.get('#item-description-input').type(description);
});

When('O usuário clica em "Criar"', () => {
  cy.intercept("POST", `${serverBaseUrl}/api/items`).as("CreateItemRequest");
  cy.get('#confirm-create-item-button').click();
  cy.wait("@CreateItemRequest").then((interception) => {
    if (interception.response) {
      const responseBody = interception.response.body;
      itemId = responseBody.id;
    }
  });
});

Then('um novo produto é criado e exibido no menu com o nome {string}', (name: string) => {
  cy.get(`#item-${itemId}`).should('exist').contains(name);
});

Given('O produto {string} está selecionado', (name: string) => {
  cy.get(`#item-${itemId}`).should('exist').contains(name);
});

When('O usuário insere {string} na caixa de input "Preço"', (newPrice: string) => {
  cy.get('#item-price-input').clear().type(newPrice);
});

When('O usuário clica em "Atualizar"', () => {
  cy.intercept("PUT", `${serverBaseUrl}/api/items/${itemId}`).as("UpdateItemRequest");
  cy.get('#confirm-update-item-button').click();
  cy.wait("@UpdateItemRequest");
});

Then('o produto é atualizado', () => {
  cy.get(`#item-${itemId}`).should('exist');
});

And('é exibido na listagem de produtos o produto com o novo preço', () => {
  cy.get(`#item-${itemId} .item-price`).should('contain', '0');
});

When('O usuário clica em "Deletar"', () => {
  cy.intercept("DELETE", `${serverBaseUrl}/api/items/${itemId}`).as("DeleteItemRequest");
  cy.get(`#item-${itemId} .delete-button`).click();
  cy.get('#confirm-delete-item-button').click();
  cy.wait("@DeleteItemRequest");
});

Then('o produto é deletado', () => {
  cy.get(`#item-${itemId}`).should('not.exist');
});

And('não é exibido na listagem de produtos', () => {
  cy.get(`#item-${itemId}`).should('not.exist');
});
