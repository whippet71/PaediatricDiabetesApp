/// <reference types="Cypress" />

let initialRows = 0;

context('add contact', () => {
  specify('load login page', () => {
    cy.visit('https://localhost:8080/login')
    cy.contains('Please login')
  })
  specify('login', () => {
    cy.get('#input-username').type('john.morgan')
    cy.get('#input-password').type('123')
    cy.get('.btn').click()
    cy.url().should('not.contain', 'login')
    cy.contains('Current referrals')
  })
  specify('select patient', () => {
    cy.get('[index="0"] > :nth-child(1)').click()
    // count rows in table
    cy.get('.table')
      .find('tr')
      .then(tr => {
        initialRows = Cypress.$(tr).length
      })
  })
  specify('edit contact and cancel', () => {
    cy.get('[index="0"] > :nth-child(8) > .btn').click()
    cy.get('.btn-secondary').click()
    cy.get('.table').find('tr').its('length').should('eq', initialRows)
  })
  specify('edit contact and save', () => {
    cy.get('[index="0"] > :nth-child(8) > .btn').click()
    cy.get('#input-contact-type').select('Telephone')
    cy.get('#input-activity-type').select('Insulin')
    cy.get('#input-location').select('Academy')
    cy.get('#input-hours').clear().type('1.5')
    cy.get('#input-num-contacts').clear().type('2')
    cy.get('form > .btn-primary').click()
    cy.contains('Patient contact updated') // Wait for toast
    cy.get('.table').find('tr').its('length').should('eq', initialRows)
    cy.get('[index="0"] > :nth-child(2)').contains('Telephone')
    cy.get('[index="0"] > :nth-child(3)').contains('Insulin')
    cy.get('[index="0"] > :nth-child(4)').contains('Academy')
    cy.get('[index="0"] > :nth-child(6)').contains('1.5')
    cy.get('[index="0"] > :nth-child(7)').contains('2')
  })
 
})
