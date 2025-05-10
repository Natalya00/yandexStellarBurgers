describe('Создание заказа с авторизацией', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('POST', 'api/auth/login', {
      body: {
        success: true,
        accessToken: 'Bearer mockAccessToken',
        refreshToken: 'mockRefreshToken',
        user: {
          email: 'test_email@yandex.ru',
          name: 'User'
        }
      }
    }).as('login');
    cy.visit('/login');
    cy.get('input[name="email"]').type('test_email@yandex.ru');
    cy.get('input[name="password"]').type('testPassword');
    cy.get('button').contains('Войти').click();
    cy.wait('@login');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('должен корректно оформить заказ', () => {
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-testid="643d69a5c3f7b9001cfa093e"]')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('button').contains('Оформить заказ').click({ force: true });

    cy.wait('@createOrder');
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal"]').should('contain', '12345');

    cy.get('[data-testid="modal"] button').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Краторная булка N-200i');
    cy.get('[data-testid="burger-constructor"]').should('not.contain', 'Филе Люминесцентного тетраодонтимформа');
  });
}); 