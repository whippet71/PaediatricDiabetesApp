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
  specify('add contact and cancel', () => {
    cy.contains('Add new contact').click()
    //cy.contains('Add contact')
    cy.get('.btn-secondary').click()
    cy.get('.table').find('tr').its('length').should('eq', initialRows)
  })
  specify('add contact and submit', () => {
    cy.contains('Add new contact').click()
    cy.get('#input-contact-type').select('Face to face')
    cy.get('#input-activity-type').select('Food General')
    cy.get('#input-location').select('Home')
    cy.get('#input-hours').clear().type('2.5')
    cy.get('form > .btn-primary').click()
    cy.contains('Patient contact saved') // Wait for toast
    cy.get('.table').find('tr').its('length').should('eq', initialRows + 1)
  })
})
