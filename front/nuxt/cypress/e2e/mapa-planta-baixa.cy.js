describe('MapaPlantaBaixa Component', () => {
  beforeEach(() => {
    cy.visit('/plantes')
  })

  it('should render the mapa planta baixa component', () => {
    cy.get('.mapa-container').should('exist')
  })

  it('should display the map canvas', () => {
    cy.get('canvas').should('exist')
  })

  it('should handle map interactions', () => {
    cy.get('.map-controls').should('exist')
    
    cy.get('.zoom-controls').should('exist')
  })

  it('should show plant information on interaction', () => {
    cy.get('.plant-info').should('exist')
  })
})
