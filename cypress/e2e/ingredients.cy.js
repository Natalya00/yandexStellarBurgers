describe('Тестирование API ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
  });

  it('должен успешно загрузить ингредиенты', () => {
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    cy.get('@getIngredients').its('response.body').should('deep.include', {
      success: true
    });
  });

  it('должен добавить булку в конструктор', () => {
    cy.wait('@getIngredients');
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Краторная булка N-200i');
  });

  it('должен добавить начинку в конструктор', () => {
    cy.wait('@getIngredients');
    cy.get('[data-testid="643d69a5c3f7b9001cfa093e"]')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Филе Люминесцентного тетраодонтимформа');
  });

  it('должен добавить булку и начинку в конструктор', () => {
    cy.wait('@getIngredients');
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-testid="643d69a5c3f7b9001cfa093e"]')
      .find('button')
      .contains('Добавить')
      .click();
    cy.get('[data-testid="burger-constructor"]')
      .should('contain', 'Краторная булка N-200i')
      .and('contain', 'Филе Люминесцентного тетраодонтимформа');
  });
}); 