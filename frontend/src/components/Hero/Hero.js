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
        <a className='landing-button-download' href='https://chromewebstore.google.com/detail/chatgpt-prompt-counter/djmjoepmfiooddjlmnagnnanhbjpdjkp?hl=en&pli=1' target='_blank' rel='noreferrer'>Download</a>
        </div>
      
    </div>
  )
}

export default Hero
