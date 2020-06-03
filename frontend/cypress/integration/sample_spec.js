/* eslint-disable */

describe('My Test Suite', () => {
  it('can log in and edit a review', () => {
    cy.visit('http://localhost:3000/')

    cy.contains("Log In / Sign Up").click()

    cy.url().should('include', '/auth')

    cy.get('#logInUsername')
      .type('asdf')
      .should('have.value', 'asdf')
    
    cy.get('#logInPassword')
      .type('asdf')
      .should('have.value', 'asdf')

    cy.contains('input', 'Log In').click()

    cy.url().should('not.include', '/auth')

    cy.contains('Log Out').should('be.visible')

    cy.contains("Account").click()

    cy.contains('h1', 'asdf').should('be.visible')

    cy.contains('Edit Review').click()

    cy.get('#songReview')
      .clear()
      .type('Hello, from Cypress!')
      .should('have.value', 'Hello, from Cypress!')

    cy.contains('Update Review').click()

    cy.contains('Hello, from Cypress!').should('be.visible')
  });

  it('sign up as an artist and post a song', () => {
    cy.visit('http://localhost:3000/')

    cy.contains("Log In / Sign Up").click()

    cy.url().should('include', '/auth')

    cy.get('#signUpIsArtist').click()

    cy.get('#signUpDisplayName')
      .type('Cypress UI Automation')
      .should('have.value', 'Cypress UI Automation')

    cy.get('#signUpUsername')
      .type('cypress')
      .should('have.value', 'cypress')

    cy.get('#signUpPassword')
      .type('cypress')
      .should('have.value', 'cypress')

    cy.contains('input', 'Sign Up').click()

    cy.url().should('not.include', '/auth')

    cy.contains('Log Out').should('be.visible')

    cy.get('#songName')
      .type('No Flex Zone (UI Automation REMIX)')
      .should('have.value', 'No Flex Zone (UI Automation REMIX)')
    
    cy.contains('input', 'Submit Song').click()

    cy.contains('Account').click()

    cy.contains('No Flex Zone (UI Automation REMIX)').should('be.visible')
  });

  it('search for a song and navigate to its page', () => {
    cy.visit('http://localhost:3000/')

    cy.get('#searchTerm')
      .type('ba')
      .should('have.value', 'ba')

    cy.contains('button', 'Search').click()

    cy.contains('REMIX').click()

    cy.url().should('include', '/song')

    cy.contains('Mo Bamba').should('be.visible')
  });
});
