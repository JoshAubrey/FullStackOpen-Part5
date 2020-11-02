import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('Blog Component Rendering', () => {
  const blog = {
    title: "Full Stack Open 2020",
    author: "Matti Luukkainen",
    url: "https://fullstackopen.com/en/",
    likes: 8,
    user: {
        username: "mluukkai",
        name: "Matti Luukkainen",
        id: "5f8780d42a4abe0905dc7297"
    },
    id: "5f8781078cc46d092d79c276"
  }
  const currentUser = {
      username: "mluukkai"
  }
  let component
  let mockUpdate
  let mockDelete

  beforeEach(() => {
    mockUpdate = jest.fn()
    mockDelete = jest.fn()

    component = render(
      <Blog blog={blog} currentUser={currentUser} updateBlog={mockUpdate} deleteBlog={mockDelete}/>
    )
    //component.debug()
  })

  test('renders blog title and author but not details', () => {
  
    expect(component.container).toHaveTextContent(
      'Full Stack Open 2020'
    )
    expect(component.container).toHaveTextContent(
      'Matti Luukkainen'
    )
    const detailsShown = component.container.querySelector('.detailsShown')
    expect(detailsShown).toHaveStyle('display: none')
  
  })

  test('blog details shown when button clicked', () => {
    
    const button = component.getByText('show')
    fireEvent.click(button)

    const detailsHidden = component.container.querySelector('.detailsHidden')
    expect(detailsHidden).toHaveStyle('display: none')

    const detailsShown = component.container.querySelector('.detailsShown')
    expect(detailsShown).not.toHaveStyle('display: none')

  })

  test('if like button is clicked twice, event handler is called twice', () => {
    
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockUpdate.mock.calls).toHaveLength(2)
    
  })

})