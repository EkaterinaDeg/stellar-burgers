import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login, токены, кукисы
       */
      mockLogin(): void;

      /**
       * Очистка localStorage и куки
       */
      clearMemory(): void;

      /**
       * Мок для WebSocket-запросов
       */
      mockWebSocket(): void;

      getBySelId(
        selector: string,
        childSelector?: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};