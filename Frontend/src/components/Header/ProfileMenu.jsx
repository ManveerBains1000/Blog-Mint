import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LogoutBtn from './LogoutBtn.jsx'

const ProfileMenu = () => {
  const userData = useSelector((state) => state.authReducer.userData)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const username = userData?.username || userData?.email || 'Member'
  const avatarLabel = (username?.trim()?.[0] || 'M').toUpperCase()
  const avatarImage = userData?.profileImage

  return (
    <div ref={menuRef} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((value) => !value)}
        className='group inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-left transition duration-200 hover:bg-white/10'
        aria-haspopup='menu'
        aria-expanded={open}
        aria-label='Open profile menu'
      >
        <span className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-sm font-bold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]'>
          {avatarImage ? (
            <img src={avatarImage} alt={username} className='h-full w-full object-cover' />
          ) : (
            avatarLabel
          )}
        </span>
      </button>

      {open && (
        <div className='absolute right-0 top-[calc(100%+0.75rem)] w-72 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[color:rgba(10,10,10,0.98)] shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl'>
          <div className='border-b border-white/10 p-4'>
            <div className='flex items-center gap-3'>
              <span className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white text-base font-bold text-black'>
                {avatarImage ? (
                  <img src={avatarImage} alt={username} className='h-full w-full object-cover' />
                ) : (
                  avatarLabel
                )}
              </span>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold text-white'>{username}</p>
                <p className='truncate text-xs text-[var(--theme-muted)]'>{userData?.email}</p>
              </div>
            </div>
          </div>

          <div className='p-2'>
            <Link
              to='/edit-account'
              onClick={() => setOpen(false)}
              className='block rounded-2xl px-4 py-3 text-sm font-medium text-[var(--theme-text)] transition hover:bg-white/10 hover:text-white'
            >
              Edit account
            </Link>
            <LogoutBtn
              onLogout={() => setOpen(false)}
              className='mt-1 w-full rounded-2xl justify-start border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[var(--theme-text)] hover:bg-white/10'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu