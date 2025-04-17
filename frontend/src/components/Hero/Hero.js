import React from 'react'
import { Link } from 'react-router-dom';
import './Hero.css'

const Hero = () => {
  return (
    <div className='container'>
      <h1 className='heading'>GreenGPT</h1>
      <h2 className='heading2'>Download the Extension Below!</h2>
      <div>
        <Link to="/login">
          <button className='landing-button-signup'>Sign Up</button>
        </Link>
        <a className='landing-button-download' href='https://cise.ufl.edu/~t.lu/cis4930/extension/greengpt.zip' target='_blank' rel='noreferrer'>Download</a>
        </div>
      
    </div>
  )
}

export default Hero
