/// <reference types="Cypress" />

describe('login', () => {
  it('load login page', () => {
    cy.visit('https://localhost:8080/login')
    cy.contains('Please login')
  })
  it('login', () => {
    cy.get('#input-username').type('john.morgan')
    cy.get('#input-password').type('123')
    cy.get('.btn').click()
    cy.url().should('not.contain', 'login')
    cy.contains('Current referrals')
  })
})
