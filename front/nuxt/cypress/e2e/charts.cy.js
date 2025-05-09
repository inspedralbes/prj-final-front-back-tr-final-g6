describe('Charts Component', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render the charts component', () => {
    cy.get('.chart-container').should('exist')
  })

  it('should display chart data', () => {
    cy.get('canvas').should('exist')
  })

  it('should handle user interactions', () => {
    cy.get('.chart-controls').should('exist')
    cy.get('select').first().select('1')
  })
})
