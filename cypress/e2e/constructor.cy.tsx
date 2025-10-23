/// <reference types="cypress" />

import type {} from "../../cypress/support/cypress";

describe('Главная страница, ингредиенты, конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**', (req) => {
      req.on('response', (res) => {
        if (res.headers['content-type']?.includes('text/html')) {
          console.error('HTML response detected:', req.url, res.body);
        }
      });
    }).as('allRequests');
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.mockWebSocket();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Проверка модального окна ингредиента', function () {
    beforeEach(() => {
      cy.get('[data-testid="all_ingredients_div"] li').first().as('firstIngredient');
    });

    it('Открытие модалки и проверка содержимого', function () {
      cy.get('@firstIngredient').should('exist').click();
      cy.get('[data-testid="modal_div"]').should('be.visible');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Детали ингредиента');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Краторная булка N-200i');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Калории, ккал420');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Белки, г80');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Жиры, г24');
      cy.get('[data-testid="modal_div"]').should('contain.text', 'Углеводы, г53');
    });

    it('Закрытие крестиком', function () {
      cy.get('@firstIngredient').click();
      cy.get('[data-testid="modal_close_btn"]').should('be.visible').click();
      cy.get('[data-testid="modal_div"]').should('not.exist');
    });

    it('Закрытие кликом на overlay', function () {
      cy.get('@firstIngredient').click();
      cy.get('[data-testid="modal_overlay"]').should('be.visible').click('topLeft', { force: true });
      cy.get('[data-testid="modal_div"]').should('not.exist');
    });
  });

  describe('order', function () {
    beforeEach(() => {
      cy.get('[data-testid="all_ingredients_div"] ul').as('ingredientsList');
      cy.get('@ingredientsList').eq(0).as('bun');
      cy.get('@bun').find('li').eq(1).as('second_bun');
      cy.get('@ingredientsList').eq(1).as('fillings');
      cy.get('@fillings').find('li').eq(1).as('filing');
      cy.get('@ingredientsList').eq(2).as('sauces');
      cy.get('@sauces').find('li').eq(1).as('sauce');
    });

    it('булка отобразилась в конструкторе', function () {
      cy.get('@second_bun').find('button').click();
      cy.get('@second_bun').find('[data-testid=ingredient_name]').invoke('text')
        .then((bunName) => {
          cy.get('[data-testid="top_bun_in_constructor"]').should('contain.text', bunName.trim());
        });
    });

    it('начинка отобразилась в конструкторе', function () {
      cy.get('@filing').find('button').click();
      cy.get('@filing').find('[data-testid=ingredient_name]').invoke('text')
        .then((fillingName) => {
          cy.get('[data-testid="constructor_ingredients_list"]').should('contain.text', fillingName.trim());
        });
    });

    it('соус отобразился в конструкторе', function () {
      cy.get('@sauce').find('button').click();
      cy.get('@sauce').find('[data-testid=ingredient_name]').invoke('text')
        .then((sauceName) => {
          cy.get('[data-testid="constructor_ingredients_list"]').should('contain.text', sauceName.trim());
        });
    });

    it('Собираем бургер и заказываем его', function () {
      cy.mockLogin();
      cy.get('@second_bun').find('button').click();

      cy.get('@sauces').find('li').eq(0).find('button').click();
      cy.get('@fillings').find('li').eq(1).find('button').click();
      cy.get('@sauces').find('li').eq(1).find('button').click();
      cy.get('@fillings').find('li').eq(2).find('button').click();
      cy.get('@sauces').find('li').eq(1).find('button').click();
      cy.get('@fillings').find('li').eq(1).find('button').click();
      cy.get('@sauces').find('li').eq(2).find('button').click();

      cy.get('[data-testid="make_order"]').click();
      cy.get('[data-testid="modal_div"]').should('exist');

      cy.get('[data-testid="modal_div"]').should('contain.text', '777777');

      cy.get('[data-testid="modal_close_btn"]').click();
      cy.get('[data-testid="modal_div"]').should('not.exist');
      cy.get('[data-testid="top_bun_in_constructor"]').should('not.exist');
      cy.contains('Выберите начинку').should('be.visible');

      cy.clearMemory();
    });
  });
});