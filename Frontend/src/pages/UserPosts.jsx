import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import postService from '../api/postApi.js'
import { Container, PostCard } from '../components'

function UserPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postService.getUserPosts()
        setPosts(response.data.data)
      } catch (error) {
        console.log('Error in fetching user posts', error)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className='w-full py-6 px-4 sm:px-6 lg:px-10'>
      <Container>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[var(--theme-muted)]'>Your posts</p>
            <h1 className='mt-3 text-4xl font-bold'>Everything you have published</h1>
          </div>
          <Link to='/add-post' className='inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-[var(--theme-text)] transition hover:bg-white/10'>
            Create new post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className='grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]'>
            {posts.map((post) => (
              <div key={post.slug}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className='mx-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-10 text-center text-[var(--theme-muted)] lg:mx-0'>
            You do not have any posts yet.
          </div>
        )}
      </Container>
    </div>
  )
}

export default UserPosts