describe('Flujo de login y módulo de empleados', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
    cy.get('input[formcontrolname="usuario"]').type('admin@gmail.com');
    cy.get('input[formcontrolname="contrasena"]').type('admin123');
    cy.get('button[type="submit"]').contains('Iniciar sesión').click();
    cy.url().should('include', '/dashboard');
    cy.get('.sidebar', { timeout: 10000 }).should('exist');
  });

  it('Debería mostrar la lista de empleados', () => {
    cy.get('.sidebar').trigger('mouseover');
    cy.get('.sidebar__text').contains('Empleados').click({ force: true });
    cy.url().should('include', '/empleados');
    cy.get('table').should('exist');
    cy.get('th').contains('Nombre').should('exist');
    cy.get('th').contains('Apellido Paterno').should('exist');
    cy.get('th').contains('Puesto').should('exist');
    cy.get('tbody tr').its('length').should('be.gte', 1);
  });

  it('Debería agregar un nuevo empleado y mostrarlo en la lista', () => {
    cy.get('.sidebar').trigger('mouseover');
    cy.get('.sidebar__text').contains('Empleados').click({ force: true });
    cy.url().should('include', '/empleados');
    cy.get('button.custom-add-button').contains('Nuevo Empleado').click();
    cy.get('input[formcontrolname="nombre"]').type('Cypress', { force: true });
    cy.get('input[formcontrolname="apellidoPaterno"]').type('Test', { force: true });
    cy.get('input[formcontrolname="apellidoMaterno"]').type('User', { force: true });
    cy.get('input[formcontrolname="fechaNacimiento"]').type('2000-01-01', { force: true });
    cy.get('input[formcontrolname="fechaInicioContrato"]').type('2024-06-01', { force: true });
    cy.get('mat-select[formcontrolname="idPuesto"]').click();
    cy.get('mat-option').first().click();
    cy.get('button[type="submit"]').contains('Guardar').click();
    cy.get('table').should('exist');
    cy.contains('td', 'Cypress').should('exist');
    cy.contains('td', 'Test').should('exist');
  });
}); 