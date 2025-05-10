describe('Тестирование модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен открыть модальное окно ингредиента при клике на него', () => {
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal"]').should('contain', 'Краторная булка N-200i');
  });

  it('должен закрыть модальное окно при клике на крестик', () => {
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal"] button').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен закрыть модальное окно при клике на оверлей', () => {
    cy.get('[data-testid="643d69a5c3f7b9001cfa093c"]').click();
    cy.get('[data-testid="modal"]').should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click('topLeft', { force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });
}); 