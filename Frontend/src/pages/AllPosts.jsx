import React,{useState,useEffect} from 'react'
import {Container,PostCard} from '../components/index'
import postService from '../api/postApi.js'


function AllPosts() {
    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        const fetchPosts = async () => {
            try {
                const response = await postService.getPosts();
                setPosts(response.data.data);
                }
            catch (error) {
                console.log("Error in fetching posts",error);
            }
        }
        fetchPosts();
    },[])
  return (
    <div className='w-full py-8'>
      <Container>
        <div className='flex flex-wrap'>
            {
                posts.map((post)=>(
                    <div key={post.slug} className='p-2 w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))
            }
        </div>
        </Container> 
    </div>
  )
}

export default AllPosts
