import React from 'react'
import {Container,Logo, LogoutBtn} from '../index.js'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Header = () => {
  const authStatus = useSelector((state)=>state.authReducer.status)
  const navigate = useNavigate();
  const navItems = [
    {
      name:'Home',
      slug: '/',
      active: true,
    },
    {
      name : 'Login',
      slug : '/login',
      active: !authStatus,
    },
    {
      name : 'signup',
      slug : '/signup',
      active: !authStatus,
    },
    {
      name : 'All Posts',
      slug : '/all-posts',
      active: authStatus,
    },
    {
      name : 'Add Post',
      slug : '/add-post',
      active: authStatus,
    }
  ]
  return (
    <header className='py-4 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]'>
      <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'><Logo width='70px'/></Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) => (
              item.active ? <li key={item.name}><button
              onClick={() => navigate(item.slug)}
               className='inline-block px-6 py-2 text-sm font-semibold tracking-wide text-[var(--theme-text)] transition duration-200 hover:bg-white/10 hover:text-white rounded-full'>{item.name}</button></li> : null
            ))}
            {
              authStatus && (<li><LogoutBtn/></li>)
            }
          </ul>
        </nav>

      </Container>
    </header>
  )
}

export default Header
