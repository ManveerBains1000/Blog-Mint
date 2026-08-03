import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Highlights matching text within a string by wrapping it in a <mark> tag.
 */
function highlightMatch(text, query) {
    if (!query || !text) return text;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className='bg-white/20 text-white rounded-sm px-0.5'>{part}</mark>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

/**
 * Extracts a snippet around the first occurrence of the query in the text.
 */
function getSnippet(text, query, maxLength = 120) {
    if (!text) return '';
    // Strip HTML tags for content snippets
    const plainText = text.replace(/<[^>]*>/g, '');

    if (!query) return plainText.slice(0, maxLength) + (plainText.length > maxLength ? '…' : '');

    const lowerText = plainText.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) {
        return plainText.slice(0, maxLength) + (plainText.length > maxLength ? '…' : '');
    }

    const start = Math.max(0, matchIndex - 40);
    const end = Math.min(plainText.length, matchIndex + query.length + 80);
    let snippet = plainText.slice(start, end);

    if (start > 0) snippet = '…' + snippet;
    if (end < plainText.length) snippet = snippet + '…';

    return snippet;
}

function SearchResultCard({ post, query, compact = false }) {
    const snippet = getSnippet(post.content, query, compact ? 80 : 140);

    if (compact) {
        return (
            <Link
                to={`/post/${post.slug}`}
                className='flex items-center gap-3 rounded-2xl px-3 py-2.5 transition duration-200 hover:bg-white/[0.06]'
            >
                {post.featuredImage && (
                    <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-white/10'>
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className='h-full w-full object-cover'
                        />
                    </div>
                )}
                <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-[var(--theme-text)]'>
                        {highlightMatch(post.title, query)}
                    </p>
                    <p className='mt-0.5 truncate text-xs text-[var(--theme-muted)]'>
                        {getSnippet(post.content, query, 60)}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/post/${post.slug}`}
            className='group block rounded-[20px] border border-[var(--theme-border)] bg-[linear-gradient(180deg,_#0b0b0b_0%,_#080808_100%)] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]'
        >
            <div className='flex gap-4'>
                {post.featuredImage && (
                    <div className='h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_6px_14px_rgba(0,0,0,0.3)]'>
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]'
                        />
                    </div>
                )}
                <div className='min-w-0 flex-1'>
                    <h3 className='text-base font-semibold leading-snug tracking-tight text-[var(--theme-text)]'>
                        {highlightMatch(post.title, query)}
                    </h3>
                    <p className='mt-1.5 text-sm leading-relaxed text-[var(--theme-muted)]'>
                        {highlightMatch(snippet, query)}
                    </p>
                    {post.owner && (
                        <p className='mt-2 text-xs text-[var(--theme-muted)]/60'>
                            by {post.owner.username}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default SearchResultCard;
