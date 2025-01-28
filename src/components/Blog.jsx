import { useState } from 'react'
import blogService from '../services/blogs'
import React from 'react'
import PropTypes from 'prop-types'


function Blog({ blog, updateBlog, handleDelete }) {
  const [visibleDetail, setVisibleDetail] = useState(false)
  const [amLike, setAmLike] = useState(blog.likes || 0)


  const visibilty = () => {
    setVisibleDetail(!visibleDetail)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    try {
      const updatedBlog = { ...blog, likes: blog.likes + 1 }
      const response = await blogService.update(blog.id, updatedBlog)
      updateBlog(updatedBlog)
      setAmLike(updatedBlog.likes)
    } catch (error) {
      console.error("Updating fail", error)
    }
  }


  const visible = () => {
    return (
      <div>
        <p>{blog.url}</p>
        <p>likes {amLike} <button onClick={handleLike}>Like</button></p>
        <p>{blog.author}</p>
        <button onClick={() => handleDelete(blog)}>remove</button>
      </div>
    )
  }

  return (
    <div className="Blog" style={blogStyle}>
      <div className="Blog-Title">
        {blog.title}
        <button onClick={visibilty}>{visibleDetail ? 'Hide' : 'View'}</button>
        <div className="Blog-Details" style={{display: visibleDetail ? 'block' : 'none'}}>
          <div>{blog.url}</div>
          <div>likes {amLike} <button onClick={handleLike}>Like</button></div>
          <div className="Blog-Author">{blog.author}</div>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes={
  blog: PropTypes.object.isRequired, 
  updateBlog: PropTypes.func, 
  handleDelete: PropTypes.func
}

export default Blog