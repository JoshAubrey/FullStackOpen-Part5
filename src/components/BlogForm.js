import React from 'react'

const BlogForm = ({
    addBlog, 
    newTitle, 
    handleTitleChange, 
    newAuthor, 
    handleAuthorChange, 
    newURL, 
    handleURLChange
    }) => {
    return (
      <div>
        <form onSubmit={addBlog}>
            <div>
                title: <input value={newTitle} onChange={handleTitleChange}/>
            </div>
            <div>
                author: <input value={newAuthor} onChange={handleAuthorChange}/>
            </div>
            <div>
                url: <input value={newURL} onChange={handleURLChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
      </div>
    )
}

export default BlogForm