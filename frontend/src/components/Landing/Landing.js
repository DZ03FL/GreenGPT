import './Landing.css'
import React from 'react'

const Landing = () => {
  return (
    <div>
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
      <div>
        <h1>GreenGPT</h1>
        <h2>Download the Extension Below!</h2>
        <button>Sign Up</button>
        <button>Download</button>
        <h3>GreenGPT Extension</h3>
        <h4>Subtitle</h4>
        <p>Do you want to spring into action and conserve energy? Download this extension and you will be able to keep track of your energy usage for AI tools!</p>
        <p>
          Track the electricity and water used in the ChatGPT cooling process, saving the world by recognizing how much energy we utilize with AI tools. Visualize ChatGPT energy usage and compete with friends for the title of Most Environmentally Friendly!
        </p>
      </div>
    </div>
    
  )
}

export default Landing
