/// <reference types="cypress" />

describe('Главная страница, ингредиенты, конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Проверка модального окна ингредиента', function () {
    beforeEach(() => {
      // Ищем первый ингредиент в списке
      cy.get('[data-testid^="ingredient_"]').first().as('firstIngredient');
    });

    it('Открытие модалки и проверка содержимого', function () {
      cy.get('@firstIngredient').click();
      
      // После клика должен произойти переход на страницу ингредиента
      cy.url().should('include', '/ingredients/');
      
      // Проверяем модальное окно на странице СТРОГО внутри modal
      cy.getBySelId('modal', { timeout: 5000 })
        .should('be.visible')
        .within(() => {
          cy.contains('Детали ингредиента').should('be.visible');
          cy.contains('Краторная булка N-200i').should('be.visible');
          cy.contains('Калории').should('be.visible');
          cy.contains('420').should('be.visible');
        });
    });

    it('Закрытие крестиком', function () {
      cy.get('@firstIngredient').click();
      cy.url().should('include', '/ingredients/');
      
      // Проверяем, что модалка открыта
      cy.getBySelId('modal', { timeout: 5000 }).should('be.visible');
      
      // Закрываем крестиком
      cy.getBySelId('modal_close').click();
      
      // Проверяем, что модалка закрылась и мы вернулись на главную
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.getBySelId('modal').should('not.exist');
    });

    it('Закрытие кликом на overlay', function () {
      cy.get('@firstIngredient').click();
      cy.url().should('include', '/ingredients/');
      
      // Проверяем, что модалка открыта
      cy.getBySelId('modal', { timeout: 5000 }).should('be.visible');
      
      // Закрываем через overlay
      cy.getBySelId('modal_overlay').click({ force: true });
      
      // Проверяем, что модалка закрылась и мы вернулись на главную
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.getBySelId('modal').should('not.exist');
    });
  });

  describe('Конструктор бургера', function () {
    beforeEach(() => {
      // Правильные селекторы для категорий ингредиентов
      cy.get('[data-testid="all_ingredients_div"]').within(() => {
        // Булки - первая секция
        cy.get('ul').eq(0).as('bunList');
        // Начинки - вторая секция  
        cy.get('ul').eq(1).as('fillingList');
        // Соусы - третья секция
        cy.get('ul').eq(2).as('sauceList');
      });
      
      // Конкретные ингредиенты
      cy.get('@bunList').find('li').eq(1).as('secondBun');
      cy.get('@fillingList').find('li').eq(1).as('filling');
      cy.get('@sauceList').find('li').eq(1).as('sauce');
    });

    it('Булка отобразилась в конструкторе', function () {
      cy.get('@secondBun').within(() => {
        cy.get('[data-testid="ingredient_name"]').invoke('text').as('bunName');
        cy.get('button').contains('Добавить').click();
      });
      
      // Проверяем СТРОГО внутри конструктора
      cy.getBySelId('burger_constructor').within(() => {
        cy.get('@bunName').then((bunName) => {
          cy.getBySelId('top_bun_in_constructor').should('contain.text', bunName.toString().trim());
        });
      });
    });

    it('Начинка отобразилась в конструкторе', function () {
      cy.get('@filling').within(() => {
        cy.get('[data-testid="ingredient_name"]').invoke('text').as('fillingName');
        cy.get('button').contains('Добавить').click();
      });
      
      // Проверяем СТРОГО внутри списка ингредиентов конструктора
      cy.getBySelId('constructor_ingredients_list').within(() => {
        cy.get('@fillingName').then((fillingName) => {
          cy.contains(fillingName.toString().trim()).should('be.visible');
        });
      });
    });

    it('соус отобразился в конструкторе', function () {
      cy.get('@sauce').within(() => {
        cy.get('[data-testid="ingredient_name"]').invoke('text').as('sauceName');
        cy.get('button').contains('Добавить').click();
      });
      
      // Проверяем СТРОГО внутри списка ингредиентов конструктора
      cy.getBySelId('constructor_ingredients_list').within(() => {
        cy.get('@sauceName').then((sauceName) => {
          cy.contains(sauceName.toString().trim()).should('be.visible');
        });
      });
    });

    it('Собираем бургер и заказываем его', function () {
      // Авторизация
      cy.mockLogin();

      // Добавляем ингредиенты через клик (как настоящий пользователь)
      cy.get('@secondBun').find('button').contains('Добавить').click();
      cy.get('@sauceList').find('li').eq(0).find('button').contains('Добавить').click();
      cy.get('@fillingList').find('li').eq(1).find('button').contains('Добавить').click();
      cy.get('@sauceList').find('li').eq(1).find('button').contains('Добавить').click();

      // Мокаем ответ API для создания заказа
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      // Оформляем заказ
      cy.getBySelId('make_order').click();
      
      // Проверяем модальное окно заказа СТРОГО внутри modal
      cy.getBySelId('modal', { timeout: 10000 })
        .should('be.visible')
        .within(() => {
          cy.contains('12345').should('be.visible'); // номер заказа
          cy.contains('идентификатор заказа').should('be.visible');
          cy.contains('Ваш заказ начали готовить').should('be.visible');
        });

      // Закрываем модальное окно
      cy.getBySelId('modal_close').click();
      
      // Проверяем, что модалка действительно закрылась
      cy.getBySelId('modal').should('not.exist');

      // Тщательно проверяем, что конструктор полностью очистился СТРОГО внутри конструктора
      cy.getBySelId('burger_constructor').within(() => {
        // Проверяем, что булки очистились
        cy.contains('Выберите булки').should('be.visible');
        
        // Проверяем, что начинки очистились
        cy.contains('Выберите начинку').should('be.visible');
        
        // Дополнительная проверка - убеждаемся, что нет добавленных ингредиентов
        cy.getBySelId('constructor_ingredients_list').within(() => {
          // Не должно быть элементов ингредиентов, только текст "Выберите начинку"
          cy.get('[data-testid^="ingredient_"]').should('not.exist');
        });
      });

      cy.clearMemory();
    });
  });
});