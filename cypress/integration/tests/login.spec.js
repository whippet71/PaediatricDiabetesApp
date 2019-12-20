/// <reference types="Cypress" />

context('login', () => {
  specify('load login page', () => {
    cy.visit('./login')
    cy.contains('Please login')
  })
  specify('login', () => {
    cy.get('#input-username').type('john.morgan')
    cy.get('#input-password').type('123')
    cy.get('.btn').click()
    cy.url().should('not.contain', 'login')
    cy.contains('Current referrals')
    cy.contains('Patient list updated') // Wait for toast
  })
})
