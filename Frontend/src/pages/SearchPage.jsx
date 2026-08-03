import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, PostCard } from '../components/index'
import SearchResultCard from '../components/SearchResultCard.jsx'
import postService from '../api/postApi.js'

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const response = await postService.searchPosts(query.trim());
                if (response && response.data) {
                    setResults(response.data.data || []);
                }
            } catch (error) {
                console.log('SearchPage :: fetch error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
                setHasSearched(true);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className='w-full py-6 px-4 sm:px-6 lg:px-10'>
            <Container>
                {/* Header */}
                <div className='mb-10'>
                    <p className='text-xs font-semibold uppercase tracking-[0.3em] text-[var(--theme-muted)]'>
                        Search results
                    </p>
                    <h1 className='mt-3 text-4xl font-bold'>
                        {query ? (
                            <>
                                Results for{' '}
                                <span className='bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent'>
                                    "{query}"
                                </span>
                            </>
                        ) : (
                            'Search posts'
                        )}
                    </h1>
                    {hasSearched && !isLoading && (
                        <p className='mt-2 text-sm text-[var(--theme-muted)]'>
                            {results.length} post{results.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className='grid gap-4'>
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className='animate-pulse rounded-[20px] border border-[var(--theme-border)] bg-white/[0.02] p-4'
                            >
                                <div className='flex gap-4'>
                                    <div className='h-20 w-28 flex-shrink-0 rounded-2xl bg-white/[0.04]' />
                                    <div className='flex-1 space-y-3 pt-1'>
                                        <div className='h-4 w-3/4 rounded-full bg-white/[0.06]' />
                                        <div className='h-3 w-full rounded-full bg-white/[0.04]' />
                                        <div className='h-3 w-2/3 rounded-full bg-white/[0.04]' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No results */}
                {!isLoading && hasSearched && results.length === 0 && (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.03)]'>
                            <svg className='h-10 w-10 text-[var(--theme-muted)]/40' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                            </svg>
                        </div>
                        <h2 className='text-xl font-semibold text-[var(--theme-text)]'>No posts found</h2>
                        <p className='mt-2 max-w-sm text-center text-sm text-[var(--theme-muted)]'>
                            We couldn't find any posts matching <strong>"{query}"</strong>. Try a different search term or browse all posts.
                        </p>
                    </div>
                )}

                {/* No query entered */}
                {!isLoading && !hasSearched && !query && (
                    <div className='flex flex-col items-center justify-center py-20'>
                        <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.03)]'>
                            <svg className='h-10 w-10 text-[var(--theme-muted)]/40' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1}>
                                <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                            </svg>
                        </div>
                        <h2 className='text-xl font-semibold text-[var(--theme-text)]'>Search for posts</h2>
                        <p className='mt-2 max-w-sm text-center text-sm text-[var(--theme-muted)]'>
                            Use the search bar above to find posts by title or content.
                        </p>
                    </div>
                )}

                {/* Results grid */}
                {!isLoading && results.length > 0 && (
                    <div className='grid gap-4'>
                        {results.map((post) => (
                            <SearchResultCard
                                key={post._id}
                                post={post}
                                query={query}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default SearchPage;
