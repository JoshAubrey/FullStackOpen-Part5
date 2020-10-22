import React from 'react'
const Blog = ({ blog }) => (
  <div>
    <p><a href={blog.url}>{blog.title}</a> by {blog.author} </p>
    <p>Likes: {blog.likes}</p>
  </div>
)

export default Blog
