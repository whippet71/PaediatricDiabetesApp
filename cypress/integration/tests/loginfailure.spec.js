/// <reference types="Cypress" />

context('login', () => {
  specify('load login page', () => {
    cy.visit('https://localhost:8080/login')
    cy.contains('Please login')
  })
  specify('login', () => {
    cy.get('#input-username').type('john.morgan')
    cy.get('#input-password').type('fail')
    cy.get('.btn').click()
    cy.url().should('contain', 'login')
    cy.contains('Login failed')
  })
})
