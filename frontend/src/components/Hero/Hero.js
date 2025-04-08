import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <div className='container'>
      <h1 className='heading'>GreenGPT</h1>
      <h2 className='heading2'>Download the Extension Below!</h2>
      <div>
      <button className='landing-button-signup'>Sign Up</button>
      <a className='landing-button-download' href='https://chromewebstore.google.com/detail/chatgpt-prompt-counter/djmjoepmfiooddjlmnagnnanhbjpdjkp?hl=en&pli=1' target='_blank' rel='noreferrer'>Download</a>
      </div>
      
    </div>
  )
}

export default Hero
