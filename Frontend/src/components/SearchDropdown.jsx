import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchResultCard from './SearchResultCard.jsx'

function SearchDropdown({ results, query, isLoading, isVisible, onClose }) {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                onClose();
            }
        }
        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isVisible, onClose]);

    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const handleViewAll = () => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
        onClose();
    };

    return (
        <div
            ref={dropdownRef}
            className='absolute left-0 right-0 top-full mt-2 z-[60] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(12,12,12,0.96)] shadow-[0_24px_48px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
            style={{ minWidth: '320px' }}
        >
            {/* Loading state */}
            {isLoading && (
                <div className='flex items-center justify-center gap-3 px-4 py-6'>
                    <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80' />
                    <span className='text-sm text-[var(--theme-muted)]'>Searching…</span>
                </div>
            )}

            {/* No results */}
            {!isLoading && query && results.length === 0 && (
                <div className='px-4 py-6 text-center'>
                    <div className='mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5'>
                        <svg className='h-5 w-5 text-[var(--theme-muted)]' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                        </svg>
                    </div>
                    <p className='text-sm font-medium text-[var(--theme-text)]'>No results found</p>
                    <p className='mt-1 text-xs text-[var(--theme-muted)]'>Try a different keyword</p>
                </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
                <>
                    <div className='border-b border-white/5 px-4 py-2'>
                        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-muted)]'>
                            {results.length} result{results.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className='max-h-[320px] overflow-y-auto p-1.5'>
                        {results.slice(0, 5).map((post) => (
                            <div key={post._id} onClick={onClose}>
                                <SearchResultCard post={post} query={query} compact />
                            </div>
                        ))}
                    </div>

                    {results.length > 5 && (
                        <div className='border-t border-white/5 p-2'>
                            <button
                                onClick={handleViewAll}
                                className='w-full rounded-xl py-2.5 text-center text-sm font-medium text-[var(--theme-text)] transition duration-200 hover:bg-white/[0.06]'
                            >
                                View all {results.length} results →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SearchDropdown;
