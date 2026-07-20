import React from 'react'
import { Container,PostForm } from '../components/index'
function AddPost() {
  return (
    <div className='px-4 py-6 sm:px-6 lg:px-10'>
      <Container>
        <div className='mx-auto max-w-5xl'>
          <PostForm />
        </div>
      </Container>
    </div>
  )
}

export default AddPost
