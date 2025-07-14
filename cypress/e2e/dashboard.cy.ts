describe('Flujo completo de la aplicación', () => {
    beforeEach(() => {
        // Para tests E2E, necesitarías una forma de mockear la sesión de NextAuth
        // o usar credenciales de un usuario de prueba.
        // cy.login() es un comando personalizado que deberías crear en cypress/support/commands.ts
        // Por ahora, asumimos que el login funciona y visitamos el dashboard.
        cy.visit('/dashboard');
    });

    it('debería cargar el dashboard con los módulos iniciales', () => {
        cy.contains('Fábrica de Módulos').should('be.visible');
        // Asume que el canvas de Phaser tiene un elemento identificable
        cy.get('#phaser-container canvas').should('be.visible');
    });

    it('debería activar un módulo y persistir el cambio', () => {
        // Intercepta la llamada a la API para verificarla
        cy.intercept('POST', '/api/tenant/me').as('updateTenant');

        // Busca un módulo que esté desactivado y lo activa
        // (Ajusta el selector según tu UI)
        cy.contains('label', 'CRM').parent().find('input[type="checkbox"]').uncheck().check();

        // Espera a que la llamada a la API se complete y la verifica
        cy.wait('@updateTenant').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            // Verifica que el payload enviado a la API contiene el módulo 'crm'
            expect(interception.request.body.activeModules).to.include('crm');
        });

        // Podrías añadir una verificación visual en el canvas si tus sprites tienen IDs o clases
    });
});
