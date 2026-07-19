import React from 'react'
import LogoImage from '../assets/hero.png'
const Logo = ({width = '20px'}) => {
  return (
    <div className='ml-2 rounded-xl px-3 py-2 text-xs font-semibold tracking-[0.2em] text-black flex items-center justify-center'>
      <img src={LogoImage} alt="logo" width={20} />
    </div>
  )
}

export default Logo
