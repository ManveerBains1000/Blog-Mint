import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../api/auth.js'
import {logout} from '../../store/authSlice.js'


const LogoutBtn = ({ className = '', onLogout }) => {
    const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(logout())
      onLogout?.()
      navigate('/login')
    }
    }  
  return (
  <button className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold tracking-wide text-[var(--theme-text)] transition duration-200 hover:bg-white/10 hover:text-white ${className}`}
    onClick={logoutHandler}>
        Logout
    </button>
  )
}

export default LogoutBtn
