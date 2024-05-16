import React from 'react'
import './Navbar.css'
import navlogo from '../Assets/logo.png'
import navprofileIcon from '../Assets/akanksha.jpg'

const Navbar = () => {
  return (
    <div className='navbar'>
    <div className='nav-logo'>
    <img src={navlogo} alt="" />
    <h3>ABHUSHAN</h3>
    </div>
      

      <img src={navprofileIcon} className='nav-profile' alt="" />
    </div>
  )
}

export default Navbar
