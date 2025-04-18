import React from 'react'
import { Link } from 'react-router-dom';
import './Hero.css'
import logo2 from './GreenGPT_logo_green.svg';

const Hero = () => {
  return (
    <div className='container'>
      <div className='logo-container-hero'>
        <img src={logo2} alt="GreenGPT logo" className="logo2-img" />
        <h1 className='heading'>GreenGPT</h1>
      </div>
      <h2 className='heading2'>Think Green. Chat Clean.</h2>
      <div className='button-container'>
          <a className='landing-button-download' href='https://cise.ufl.edu/~t.lu/cis4930/extension/extension.zip' target='_blank' rel='noreferrer'>Download</a>
        <Link to="/signup">
          <button className='landing-button-signup'>Sign Up</button>
        </Link>
        </div>
      
    </div>
  )
}

export default Hero
