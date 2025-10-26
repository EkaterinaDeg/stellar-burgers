// cypress\support\commands.ts
// /// <reference types="cypress" />

import type {} from './commands';

const URL = 'https://norma.nomoreparties.space/api';

Cypress.Commands.add('mockLogin', (): void => {
  // в результате, мы становимся авторизованными с пользователем
  // из cypress/fixtures/user.json
  cy.intercept('POST', '**/auth/login', { fixture: 'login' }).as('postLogin');
  cy.intercept('GET', '**/auth/user', { fixture: 'user' }).as('getUser');
  cy.intercept('POST', '**/orders', { fixture: 'order' }).as('order');
  window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
  );
  cy.setCookie('accessToken', 'test-accessToken');
  cy.visit('/');


  cy.intercept('POST', `/login`, { fixture: 'login' }).as('postLogin');
  cy.intercept('GET', `${URL}/auth/user`, { fixture: 'user' }).as('getUser');
  window.localStorage.setItem(
  'refreshToken',
  JSON.stringify('test-refreshToken')
  );
  cy.setCookie('accessToken', 'test-accessToken');
});

Cypress.Commands.add('clearMemory', (): void => {
  cy.clearLocalStorage();
  cy.clearCookies();
});


Cypress.Commands.add('getBySelId', (
  selector: string,
  childSelector?: string,
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
) => {
  const fullSelector = `[data-testid=${selector}]${childSelector ? ' ' + childSelector : ''}`;
  return cy.get(fullSelector, options);
});

// ---- Универсальный селектор по data-testid ----
Cypress.Commands.add('getBySelId', (id: string) => {
  return cy.get(`[data-testid="${id}"]`);
});

// ---- Очистка данных ----
Cypress.Commands.add('clearMemory', () => {
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
  cy.clearCookies();
});

// ---- Типизация ----
declare global {
  namespace Cypress {
    interface Chainable {
      getBySelId(id: string): Chainable<JQuery<HTMLElement>>;
      clearMemory(): Chainable<void>;
    }
  }
}

export {};