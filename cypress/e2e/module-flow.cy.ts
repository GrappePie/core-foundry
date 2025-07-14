describe('Flujo de activación y conexión de módulos', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('activa un módulo y crea una conexión', () => {
    cy.intercept('POST', '/api/tenant/me').as('updateTenant');

    cy.contains('label', 'CRM').parent().find('input[type="checkbox"]').uncheck().check();
    cy.wait('@updateTenant');

    cy.get('#phaser-container canvas')
      .click(150, 150, { shiftKey: true })
      .click(200, 200, { shiftKey: true });
    cy.wait('@updateTenant');
  });
});
