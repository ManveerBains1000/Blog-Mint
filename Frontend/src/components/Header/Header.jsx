import React, { useState, useCallback } from 'react'
import { Container, Logo } from '../index.js'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileMenu from './ProfileMenu.jsx'
import SearchBar from '../SearchBar.jsx'
import SearchDropdown from '../SearchDropdown.jsx'
import postService from '../../api/postApi.js'

const Header = () => {
  const authStatus = useSelector((state)=>state.authReducer.status)
  const location = useLocation();

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      setIsDropdownVisible(false);
      return;
    }

    setSearchQuery(query.trim());
    setIsSearchLoading(true);
    setIsDropdownVisible(true);

    try {
      const response = await postService.searchPosts(query.trim());
      if (response && response.data) {
        setSearchResults(response.data.data || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.log('Header search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  }, [searchResults]);

  const handleSearchClear = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
    setIsDropdownVisible(false);
  }, []);

  const navItems = [
    {
      name:'Home',
      slug: '/',
      authOnly: false,
    },
    {
      name: 'All Posts',
      slug: '/all-posts',
      authOnly: true,
    },
    {
      name: 'My Posts',
      slug: '/user-posts',
      authOnly: true,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      authOnly: true,
    },
    {
      name: 'Login',
      slug: '/login',
      guestOnly: true,
    },
    {
      name: 'Signup',
      slug: '/signup',
      guestOnly: true,
    }
  ]
  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-[rgba(5,5,5,0.72)] backdrop-blur-xl'>
      <Container>
        <nav className='flex items-center gap-4 px-4 py-3 lg:px-4'>
          <div className='mr-2 flex items-center gap-3'>
            <Link to='/' className='inline-flex items-center gap-3'>
              <Logo width='28px'/>
            </Link>
          </div>
          <div className='hidden h-10 w-px bg-white/10 lg:block' />

          {/* Search Bar with Dropdown */}
          <div className='relative hidden lg:block'>
            <SearchBar
              onSearch={handleSearch}
              onFocus={handleSearchFocus}
              onClear={handleSearchClear}
            />
            <SearchDropdown
              results={searchResults}
              query={searchQuery}
              isLoading={isSearchLoading}
              isVisible={isDropdownVisible}
              onClose={() => setIsDropdownVisible(false)}
            />
          </div>

          <ul className='ml-auto flex flex-wrap items-center gap-2'>
            {navItems.map((item) => (
              ((authStatus && !item.guestOnly) || (!authStatus && !item.authOnly)) ? (
                <li key={item.name}>
                  <Link
                    to={item.slug}
                    className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-medium tracking-wide transition duration-200 ${location.pathname === item.slug ? '!bg-white !text-black shadow-[0_0_0_1px_rgba(255,255,255,0.14)]' : 'text-[var(--theme-text)] hover:bg-white/10 hover:text-white'}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ) : null
            ))}
            {
              authStatus && (<li><ProfileMenu/></li>)
            }
          </ul>
          
        </nav>

      </Container>
    </header>
  )
}

export default Header

