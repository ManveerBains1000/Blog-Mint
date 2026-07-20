import React,{useState,useEffect} from 'react'
import { Container, PostCard } from '../components/index'
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
        <div className='w-full py-6 px-4 sm:px-6 lg:px-10'>
            <Container>
            <div className='mb-8'>
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[var(--theme-muted)]'>All posts</p>
                    <h1 className='mt-3 text-4xl font-bold'>Latest writing from the community</h1>
                </div>
            <div className='grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]'>
                        {
                                posts.map((post)=>(
                                        <div key={post.slug}>
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
