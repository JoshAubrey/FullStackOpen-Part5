describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      
      const user = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user) 

      cy.visit('http://localhost:3000')
    })
  
    it('Login form is shown', function() {
      cy.contains('log in to application')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
        
            cy.contains('Matti Luukkainen logged-in')
        })
    
        it('fails with wrong credentials', function() {
            cy.get('#username').type('mluukkai')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()
            cy.get('.error').contains('Wrong credentials')
            cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            // cy.request('POST', 'http://localhost:3003/api/login', {
            //     username: 'mluukkai', password: 'salainen'
            // }).then(response => {
            //     localStorage.setItem('loggedBloglistUser', JSON.stringify(response.body))
            //     cy.visit('http://localhost:3000')
            // })
            cy.login({ username: 'mluukkai', password: 'salainen' })
        })
    
        it('A blog can be created', function() {
            cy.contains('Add new').click()
            cy.get('#title').type('cypress title')
            cy.get('#author').type('cypress author')
            cy.get('#url').type('cypress url')
            cy.contains('add').click()
            cy.contains('cypress title')
        })

        describe.only('and several blogs exist', function () {
            beforeEach(function () {
              cy.createBlog({ title: 'first blog', author: 'cy', url: 'cy' })
              cy.createBlog({ title: 'second blog', author: 'cy', url: 'cy' })
              cy.createBlog({ title: 'third blog', author: 'cy', url: 'cy' })
            })
      
            it('one of them can be liked', function () {
                cy.contains('second blog')
                .next().contains('show').click()

                cy.contains('second blog').parent().parent()
                .contains('like')
                .click()

                cy.contains('second blog').parent().parent()
                .get('#likes').should('contain', '1') //assertion, https://docs.cypress.io/api/commands/should.html#Syntax
            })

            it('one of them can be deleted', function () {
                cy.contains('third blog')
                .next().contains('show').click()

                cy.contains('third blog').parent().parent()
                .contains('delete')
                .click()

                cy.should('not.contain', 'third blog')
            })
            it('one with most likes is first', function () {
                cy.contains('second blog')
                .next().contains('show').click()

                cy.contains('second blog').parent().parent()
                .contains('like')
                .click()

                cy.get('.blog:first').should('contain', 'second blog')
                cy.get('.blog:first').get('#likes').should('contain', '1')
            })
        })
    })

  })