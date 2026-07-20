import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components'

const highlights = [
        {
                title: 'Read in one clean flow',
                text: 'A focused landing page and a quieter interface make the reading experience feel deliberate, not crowded.',
        },
        {
                title: 'Publish when you are ready',
                text: 'Logged-in users can jump straight to all posts, their own posts, and the editor from the navbar.',
        },
        {
                title: 'Protected by design',
                text: 'Logout hides post navigation and keeps post routes behind authentication instead of only hiding buttons.',
        },
]

function Home() {
    return (
        <div className='relative overflow-hidden'>
            <div className='pointer-events-none absolute inset-0 -z-10'>
                <div className='absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-white/10 blur-3xl' />
                <div className='absolute right-[-5rem] top-24 h-80 w-80 rounded-full bg-white/5 blur-3xl' />
                <div className='absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl' />
            </div>

            <section className='px-6 pt-4 pb-12 sm:px-8 sm:pt-6 sm:pb-16 lg:px-12 lg:pt-8 lg:pb-20'>
                <Container>
                    <div className='grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12'>
                        <div className='max-w-3xl'>
                            <div className='mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--theme-muted)]'>
                                A sharper place to publish
                            </div>
                            <h1 className='max-w-3xl text-6xl font-bold leading-tight sm:text-5xl lg:text-6xl'>
                                Publish stories with a calmer, more premium reading experience.
                            </h1>
                            <p className='mt-6 max-w-2xl text-lg leading-8 text-[var(--theme-muted)]'>
                                Create beautiful blogs, discover fresh ideas, and connect with a community of passionate writers—all in one place.
                            </p>
                            <div className='mt-8 flex flex-wrap gap-4'>
                                <Link to='/signup' className='inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold !text-black transition hover:translate-y-[-1px]'>
                                    Get started
                                </Link>
                                <Link to='/login' className='inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-[var(--theme-text)] transition hover:bg-white/10'>
                                    Sign in
                                </Link>
                            </div>
                            <div className='mt-10 grid gap-4 sm:grid-cols-3'>
                                {[
                                    ['01', 'Landing page'],
                                    ['02', 'Protected reading'],
                                    ['03', 'Personal posts'],
                                ].map(([index, label]) => (
                                    <div key={label} className='rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm'>
                                        <div className='text-xs font-semibold uppercase tracking-[0.3em] text-[var(--theme-muted)]'>{index}</div>
                                        <div className='mt-3 text-sm font-medium text-[var(--theme-text)]'>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='relative mt-2 lg:mt-8'>
                            <div className='absolute inset-0 -rotate-6 rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur-xl' />
                            <div className='relative rounded-[2rem] border border-white/10 bg-[color:rgba(11,11,11,0.9)] p-6 shadow-2xl shadow-black/40'>
                                <div className='flex items-center justify-between border-b border-white/10 pb-4'>
                                    <div>
                                        <p className='text-xs uppercase tracking-[0.3em] text-[var(--theme-muted)]'>Editorial space</p>
                                        <h2 className='mt-2 text-2xl font-semibold'>Built for focused reading</h2>
                                    </div>
                                    <div className='h-3 w-3 rounded-full bg-white' />
                                </div>
                                <div className='space-y-4 pt-5 text-sm leading-7 text-[var(--theme-muted)]'>
                                    <p>
                                        Explore trending articles from writers around the globe.
                                    </p>
                                    <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-[var(--theme-text)]'>
                                        From thoughts to trends—start your journey here.
                                    </div>
                                    <div className='rounded-2xl border border-white/10 bg-white/5 p-4 text-[var(--theme-text)]'>
                                        Your words deserve a beautiful home.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className='px-4 pb-16 sm:pb-20 lg:pb-24'>
                <Container>
                    <div className='grid gap-4 lg:grid-cols-3'>
                        {highlights.map((item) => (
                            <article key={item.title} className='rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm'>
                                <h3 className='text-xl font-semibold'>{item.title}</h3>
                                <p className='mt-3 text-sm leading-7 text-[var(--theme-muted)]'>{item.text}</p>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>
        </div>
    )
}

export default Home
