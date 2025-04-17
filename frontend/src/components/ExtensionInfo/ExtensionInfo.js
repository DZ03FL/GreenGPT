import React from 'react'
import './ExtensionInfo.css'
import chatLogo from './ChatGPT_Logo.svg';

const ExtensionInfo = () => {
  return (
    <div className='extension-container'>
      <img src={chatLogo} alt="Extension to track ChatGPT Prompts" className="chatgpt-logo"></img>
      <div className='description-container'>
      <p>Do you want to spring into action and conserve energy? Download this extension and you will be able to keep track of your energy usage for AI tools!</p>
      <p>
      Track the electricity and water behind ChatGPT’s cooling process, visualize your usage, and compete with friends to become the most environmentally conscious chatter!
      </p>
      <a
        href="https://chromewebstore.google.com/detail/chatgpt-prompt-counter/djmjoepmfiooddjlmnagnnanhbjpdjkp?hl=en&pli=1"
        className="arrow heading3"
        target="_blank"
        rel="noreferrer"
      >
        Try out extension<span className="arrow-right"></span>
      </a>
      </div>     
    </div>
    
  )
}

export default ExtensionInfo
