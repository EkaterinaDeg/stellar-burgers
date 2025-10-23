Cypress.Commands.add('getBySelId', (id: string) => {
  return cy.get(`[data-testid="${id}"]`);
});

// ---- Добавляем mockLogin ----
Cypress.Commands.add('mockLogin', () => {
  cy.fixture('user.json').then((user) => {
    window.localStorage.setItem('accessToken', 'Bearer mockAccessToken');
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');
    window.localStorage.setItem('user', JSON.stringify(user));
  });

  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
  cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
});

// ---- Добавляем clearMemory ----
Cypress.Commands.add('clearMemory', () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
});

// ---- Добавляем мок для WebSocket ----
Cypress.Commands.add('mockWebSocket', () => {
  cy.intercept('GET', 'ws://localhost:3000/ws', { fixture: 'orders.json' }).as('webSocket');
});

// ---- Объявляем типы, чтобы TS не ругался ----
declare global {
  namespace Cypress {
    interface Chainable {
      getBySelId(id: string): Chainable<JQuery<HTMLElement>>;
      mockLogin(): void;
      clearMemory(): void;
      mockWebSocket(): void;
    }
  }
}

export {};