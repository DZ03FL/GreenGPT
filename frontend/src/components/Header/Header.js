import './Header.css'
import React from 'react'

const Header = () => {
  return (
    <div className="headerContainer">
    <a href="#homeGrid" className="headerGreenGPT">GreenGPT</a>
    <div>
    <a href="#homeGrid" className="headerAbout">Download</a>
    <a href="#about-me" className="headerAbout">Set Goals</a>
    <a href="#projects" className="headerAbout">Leaderboard</a>
    <a href="#skills" className="headerAbout">View Data</a>
    </div>
    <a href="#skills" className="headerAbout">Login</a>
    </div>
  )
}

export default Header
