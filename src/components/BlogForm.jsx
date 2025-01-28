import { useState } from 'react'
import PropTypes from 'prop-types'
import React from 'react'

const BlogForm = ({newBlog, setNewBlog, handleCreate}) => {

    return (
      <div>
        <form onSubmit={handleCreate}>
            <div>
              title:
                <input
                data-testid='title'
                type="text"
                value={newBlog.title}
                name="title"
                placeholder="Title"
                onChange={({target}) => setNewBlog({...newBlog, title: target.value})}
                />
            </div>
            <div>
              author:
              <input
                data-testid='author'
                type="text"
                value={newBlog.author}
                name="author"
                placeholder="Author"
                onChange={({target}) => setNewBlog({...newBlog, author: target.value})}
              />
            </div>
            <div>
              url:
              <input
                data-testid='url'
                type="text"
                value={newBlog.url}
                name="url"
                placeholder="URL"
                onChange={({target}) => setNewBlog({...newBlog, url: target.value})}
              />
            </div>
          <button type="submit">Create</button>
          </form>
        </div>
      )
}

BlogForm.propTypes = {
    newBlog: PropTypes.object.isRequired,
    handleCreate: PropTypes.func.isRequired,
    setNewBlog: PropTypes.func.isRequired
}


export default BlogForm