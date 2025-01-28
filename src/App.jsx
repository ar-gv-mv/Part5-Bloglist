import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import PropTypes from 'prop-types'
import React from 'react'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlog, setNewBlog] = useState({title:'', author:'', url:''})
  const [visible, setVisible] = useState(false)


  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
  })  
  }, [])


  const Notification = ({message}) => {
    if (message === null) {
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogOut = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      console.log('logging in with', username, password)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create(newBlog)
      setBlogs(blogs.concat(blog))
      setNewBlog({title:'', author:'', url:''})
      setErrorMessage(`a new blog ${blog.title} by ${blog.author} added!`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(blogi => blogi.id !== blog.id))
    }
  }

  const updateBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
  }


  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const sortedBlogs = blogs.sort((x,y) => y.likes-x.likes)

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username 
              <input 
                data-testid='username'
                type="text"
                value={username}
                name="Username"
                onChange={({target}) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input
              data-testid='password'
              type="password"
              value={password}
              name="Password"
              onChange={({target}) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>{user.name} logged in <button onClick={handleLogOut}>Logout</button></p>

      <h2>create new</h2>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(true)}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm 
          newBlog={newBlog}
          setNewBlog={setNewBlog}
          handleCreate={handleCreate}
        />
        <button onClick={() => setVisible(false)}>cancel</button>
      </div>

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} handleDelete={handleDelete}/>
      )}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
}

export default App