import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }
  const showDelete = { display: currentUser.username === blog.user.username ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <a href={blog.url}>{blog.title}</a> by {blog.author} <button onClick={() => setDetailsVisible(true)}>show</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          <a href={blog.url}>{blog.title}</a> by {blog.author} <button onClick={() => setDetailsVisible(false)}>hide</button>
        </div>
        <div>
          Likes: {blog.likes} <button onClick={() => updateBlog({ ...blog, likes: blog.likes+1 })}>like</button>
        </div>
        <div>
          Submitted by: {blog.user.name}
        </div>
        <div style = {showDelete}>
          <button onClick={() => deleteBlog(blog.id)}>delete</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
