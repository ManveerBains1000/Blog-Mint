import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({slug,title,featuredImage}){
    return (
        <Link to={`/post/${slug}`} className='group block'>
            <article className='w-full overflow-hidden rounded-[24px] border border-[var(--theme-border)] bg-[linear-gradient(180deg,_#0b0b0b_0%,_#080808_100%)] p-4 shadow-[0_18px_35px_rgba(0,0,0,0.45)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_46px_rgba(0,0,0,0.6)]'>
                <div className='rounded-[20px] bg-white/5 p-2'>
                    <div className='aspect-[4/3] overflow-hidden rounded-[16px] border border-white/10 shadow-[0_12px_24px_rgba(0,0,0,0.4)]'>
                        <img src={featuredImage} alt={title} className='h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]'/>
                    </div>
                </div>
                <div className='mt-4 px-1 pb-1'>
                    <h2 className='text-[1.05rem] font-semibold leading-snug tracking-tight text-[var(--theme-text)]'>{title}</h2>
                </div>
            </article>
        </Link>
    )
}

export default PostCard;