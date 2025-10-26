it('выполняет процесс создания заказа с авторизацией', () => {
  // Очищаем перед тестом
  cy.clearMemory();
  
  // ДЕБАГ: посмотрим что происходит с авторизацией
  cy.visit('/');
  cy.wait('@getIngredients');

  // Проверим есть ли индикатор авторизации на странице
  cy.get('body').then(($body) => {
    const bodyText = $body.text();
    console.log('Текст страницы до авторизации:', bodyText);
    
    // Если есть кнопка "Личный кабинет" или имя пользователя - значит авторизованы
    const isAuthorized = bodyText.includes('Ekaterina') || bodyText.includes('Личный кабинет');
    console.log('Авторизован ли пользователь?', isAuthorized);
  });

  // Добавляем ингредиенты
  cy.contains('Краторная булка N-200i').trigger('dragstart');
  cy.get('body').trigger('drop');
  
  cy.contains('Мясо бессмертных моллюсков Protostomia').trigger('dragstart');
  cy.get('body').trigger('drop');

  // Пробуем создать заказ без авторизации
  cy.contains('Оформить заказ').should('be.visible').click();

  // Смотрим что происходит
  cy.get('body').then(($body) => {
    const bodyText = $body.text();
    console.log('Текст страницы после клика:', bodyText);
  });

  // Если появляется форма логина - заполняем ее
  cy.get('body').then(($body) => {
    if ($body.find('input[name=email]').length > 0) {
      cy.get('input[name=email]').type('test@example.com');
      cy.get('input[name=password]').type('password');
      cy.get('button[type=submit]').click();
      
      // После логина снова добавляем ингредиенты и создаем заказ
      cy.contains('Краторная булка N-200i').trigger('dragstart');
      cy.get('body').trigger('drop');
      cy.contains('Мясо бессмертных моллюсков Protostomia').trigger('dragstart');
      cy.get('body').trigger('drop');
      cy.contains('Оформить заказ').click();
    }
  });

  // Ждем создания заказа
  cy.wait('@createOrder', { timeout: 10000 });
  
  // Проверяем модальное окно
  cy.contains('идентификатор заказа', { timeout: 5000 }).should('be.visible');
});