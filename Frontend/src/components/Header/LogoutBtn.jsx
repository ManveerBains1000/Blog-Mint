import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../api/auth.js'
import {logout} from '../../store/authSlice.js'


const LogoutBtn = () => {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }  
  return (
    <button className='inline-block px-6 py-2 text-sm font-semibold tracking-wide text-[var(--theme-text)] transition duration-200 hover:bg-white/10 hover:text-white rounded-full'
    onClick={logoutHandler}>
        Logout
    </button>
  )
}

export default LogoutBtn
