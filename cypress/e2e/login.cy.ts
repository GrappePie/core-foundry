// cypress/e2e/login.cy.ts
// Prueba de flujo de autenticación con Google usando Cypress
describe('Autenticación con Google', () => {
  it('Debería iniciar el flujo de sign-in y redirigir a Google', () => {
    // Visita la página de login con callback a /dashboard
    cy.visit('/auth/login?callbackUrl=/dashboard');

    // Intercepta la petición de redirección a Google
    cy.intercept('GET', 'https://accounts.google.com/**').as('googleAuth');

    // Clic en el botón de iniciar sesión con Google
    cy.contains('button', 'Iniciar sesión con Google').click();

    // Espera la petición y comprueba que la redirección es 302
    cy.wait('@googleAuth').its('response.statusCode').should('eq', 302);

    // Opcional: comprobar que la URL de la ventana cambió hacia accounts.google.com
    cy.url().should('include', 'accounts.google.com');
  });
});
