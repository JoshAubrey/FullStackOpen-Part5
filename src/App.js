import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs
          .sort((a,b) => a.likes - b.likes)
          .reverse()
        )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError(true)
      setNotification('Wrong credentials')
      setTimeout(() => {
        setError(false)
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .concat(returnedBlog)
          .sort((a,b) => a.likes - b.likes)
          .reverse()
        )
        blogFormRef.current.toggleVisibility()
        setError(false)
        setNotification(
          `Added '${blogObject.title}'`
        )
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)

        setError(true)
        setNotification(
          error.response.data.error.toString()
        )
        setTimeout(() => {
          setError(false)
          setNotification(null)
        }, 10000)
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs
          .map(blog => blog.id !== blogObject.id ? blog : returnedBlog)
          .sort((a,b) => a.likes - b.likes)
          .reverse()
        )
        // setError(false)
        // setNotification(
        //   `Updated '${blogObject.title}'`
        // )
        // setTimeout(() => {
        //   setNotification(null)
        // }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)

        setError(true)
        setNotification(
          error.response.data.error.toString()
        )
        setTimeout(() => {
          setError(false)
          setNotification(null)
        }, 10000)
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    if(window.confirm(`Delete ${blog.title} ?`)){
      blogService
        .deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setError(false)
          setNotification(
            `Deleted '${blog.title}'`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setError(true)
          setNotification(
            error.response.data.error.toString()
          )
          setTimeout(() => {
            setError(false)
            setNotification(null)
          }, 5000)
        })
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <Notification message={notification} error={error}/>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogList = () => (
    <div>
      <h1>blogs</h1>
      <Notification message={notification} error={error}/>
      <p>
        {user.name} logged-in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel='Add new' ref={blogFormRef}>
        <BlogForm createBlog={createBlog}/>
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} currentUser={user}/>
      )}
    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        blogList()
      }
    </div>
  )
}

export default App