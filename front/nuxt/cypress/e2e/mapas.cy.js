describe('Mapas Components Tests', () => {
  const mapas = [
    { name: 'Planta Baixa', path: '/plantes' },
    { name: 'Planta Subterránea', path: '/plantes/subterranea' },
    { name: 'Planta 1', path: '/plantes/planta1' },
    { name: 'Planta 2', path: '/plantes/planta2' },
    { name: 'Planta 3', path: '/plantes/planta3' }
  ]

  mapas.forEach(mapa => {
    describe(`${mapa.name}`, () => {
      beforeEach(() => {
        cy.visit(mapa.path)
        // Esperar a que el mapa se cargue completamente
        cy.get('canvas').should('be.visible')
      })

      it('debería cargar el mapa correctamente', () => {
        // Verificar que el canvas existe y es visible
        cy.get('canvas').should('exist').and('be.visible')
      })

      it('debería mostrar el título del mapa', () => {
        cy.contains(mapa.name).should('be.visible')
      })

      it('debería permitir interacción con el mapa', () => {
        const canvas = cy.get('canvas')
        
        // Simular click en el mapa
        canvas.click(300, 300)
        
        // Simular movimiento del ratón
        canvas.trigger('mousemove', { clientX: 350, clientY: 350 })
      })

      it('debería mostrar información de sensores al interactuar', () => {
        // Click en una posición donde haya un sensor
        cy.get('canvas').click(300, 300)
        
        // Verificar que se muestra la información del sensor
        cy.get('.sensor-info').should('exist')
      })

      it('debería tener controles de navegación', () => {
        // Verificar que existen los botones de navegación entre plantas
        cy.get('.nav-buttons').should('exist')
        cy.get('.nav-buttons').find('button').should('have.length.at.least', 1)
      })

      it('debería mostrar la leyenda del mapa', () => {
        // Verificar que existe la leyenda
        cy.get('.map-legend').should('exist')
      })

      it('debería permitir cambiar entre diferentes vistas', () => {
        // Si existe un selector de vistas
        cy.get('select').then($select => {
          if ($select.length) {
            cy.get('select').select('1')
            cy.wait(500)
            cy.get('canvas').should('be.visible')
          }
        })
      })
    })
  })

  // Test de navegación entre plantas
  describe('Navegación entre plantas', () => {
    it('debería permitir navegar entre diferentes plantas', () => {
      cy.visit('/plantes')
      
      // Navegar a cada planta y verificar que se carga correctamente
      mapas.forEach(mapa => {
        cy.visit(mapa.path)
        cy.url().should('include', mapa.path)
        cy.get('canvas').should('be.visible')
        cy.wait(500) // Esperar a que se cargue el mapa
      })
    })
  })

  // Test de funcionalidades específicas
  describe('Funcionalidades específicas', () => {
    it('debería mostrar datos de temperatura cuando estén disponibles', () => {
      cy.visit('/plantes')
      cy.get('.temperature-data').should('exist')
    })

    it('debería mostrar datos de humedad cuando estén disponibles', () => {
      cy.visit('/plantes')
      cy.get('.humidity-data').should('exist')
    })

    it('debería mostrar datos de CO2 cuando estén disponibles', () => {
      cy.visit('/plantes')
      cy.get('.co2-data').should('exist')
    })
  })
})
