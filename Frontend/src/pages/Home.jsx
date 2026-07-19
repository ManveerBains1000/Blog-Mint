import React,{useEffect,useState} from 'react'
import postService from '../api/postApi.js'
import { Container,PostCard } from '../components'
import { useSelector } from 'react-redux';


function Home() {
    const [posts,setPosts] = useState([]);
    const authStatus = useSelector((state)=>state.authReducer.status);

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
   
    if (authStatus !== true) {
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl font-bold hover:text-[var(--theme-muted)]'>
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.slug} className='p-2 w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
      
    </div>
  )
}

export default Home
