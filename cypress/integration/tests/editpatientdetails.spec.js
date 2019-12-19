/// <reference types="Cypress" />

describe('edit patient details', () => {
  it('load home page', () => {
    cy.visit('https://localhost:8080/')
    cy.contains('Current referrals')
  })
  it('select patient', () => {
    cy.get('[index="0"] > :nth-child(1)').click()
  })
  it('edit details', () => {
    cy.contains('Edit details').click()
    cy.contains('Edit patient details')
    cy.get('#input-key-worker').clear().type('Fred Bloggs')
    cy.get('#input-referral-date').clear().type('2019-12-02')
    cy.get('form > .btn-primary').click()
  })
  it ('verify details changed', () => {
    cy.contains('Patient details updated') // Check for toast
    cy.get(':nth-child(4) > .row > .text-left').should('contain', 'Fred Bloggs')
    cy.get(':nth-child(5) > .row > .text-left').should('contain', '02/12/2019')
  })
  it ('check home page', () => {
    cy.get(':nth-child(1) > :nth-child(1) > .nav-link').click()
    cy.contains('Current referrals')
    cy.get('[index="0"] > :nth-child(5)').should('contain', '02/12/2019')
  })
})
