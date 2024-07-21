import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import './navbar.css'

const Navbar = () => {

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      <div className='nav'>
        <div className="logo">
          <img src={logo} alt="" className='img' />
          <div className="name">walletWise</div>
        </div>
        <div className="menu-container">
          <nav className={"menu"}>
            <ul className="list">
              <li><Link to="/" >Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Navbar