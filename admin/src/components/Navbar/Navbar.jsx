import React from 'react'
import './Navbar.css'
import { assets, url } from '../../assets/assets'

const Navbar = ({ setAdminToken, adminProfile }) => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken("");
  }

  const profileSrc = adminProfile?.profileImage ? `${url}/images/${adminProfile.profileImage}` : assets.profile_image;

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='navbar-right'>
        <span>{adminProfile?.username || adminProfile?.email || "Admin"}</span>
        <img className='profile' src={profileSrc} alt="" />
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
