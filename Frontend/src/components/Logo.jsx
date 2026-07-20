import React from 'react'
import LogoImage from '../assets/hero.png'
const Logo = ({width = '20px'}) => {
  return (
    <div className='ml-2 inline-flex items-center justify-center rounded-2xl border border-white bg-black px-3 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)]'>
      <img src={LogoImage} alt="logo" style={{ width }} className='h-auto object-contain brightness-0 invert' />
    </div>
  )
}

export default Logo
