import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar({ onSearch, onFocus, onClear, value = '' }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const debounceTimer = useRef(null);

    // Sync external value prop
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleExpand = () => {
        setIsExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleCollapse = () => {
        if (!inputValue) {
            setIsExpanded(false);
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        // Debounce the search callback
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        if (val.trim()) {
            debounceTimer.current = setTimeout(() => {
                onSearch?.(val.trim());
            }, 400);
        } else {
            onClear?.();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
            onClear?.();
        }
        if (e.key === 'Escape') {
            setInputValue('');
            onClear?.();
            inputRef.current?.blur();
            setIsExpanded(false);
        }
    };

    const handleClearClick = () => {
        setInputValue('');
        onClear?.();
        inputRef.current?.focus();
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, []);

    return (
        <div className='relative'>
            <div
                className={`flex items-center overflow-hidden rounded-full border transition-all duration-300 ease-out ${
                    isExpanded
                        ? 'w-64 border-white/15 bg-white/[0.06] shadow-[0_0_24px_rgba(255,255,255,0.04)]'
                        : 'w-10 border-transparent bg-transparent hover:bg-white/[0.06]'
                }`}
            >
                {/* Search icon / toggle button */}
                <button
                    onClick={handleExpand}
                    className='flex h-10 w-10 flex-shrink-0 items-center justify-center text-[var(--theme-muted)] transition duration-200 hover:text-white'
                    aria-label='Search'
                >
                    <svg className='h-[18px] w-[18px]' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
                    </svg>
                </button>

                {/* Input */}
                <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={onFocus}
                    onBlur={handleCollapse}
                    placeholder='Search posts…'
                    className={`h-10 flex-1 bg-transparent pr-2 text-sm text-[var(--theme-text)] placeholder-[var(--theme-muted)]/50 outline-none transition-all duration-300 ${
                        isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                />

                {/* Clear button */}
                {isExpanded && inputValue && (
                    <button
                        onClick={handleClearClick}
                        className='mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--theme-muted)] transition hover:bg-white/20 hover:text-white'
                        aria-label='Clear search'
                    >
                        <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
