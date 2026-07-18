import React,{useEffect,useState} from 'react'
import appwriteService from '../appWrite/appWriteConfig'
import { Container,PostCard } from '../components'
import { useSelector } from 'react-redux';


function Home() {
    const [posts,setPosts] = useState([]);
    const authStatus = useSelector((state)=>state.authReducer.status);

    useEffect(()=>{
        appwriteService.getPosts().then((p)=>{
            if (p) {
                setPosts(p.rows)
    
            }
        })
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
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
      
    </div>
  )
}

export default Home
