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
        href="https://cise.ufl.edu/~t.lu/cis4930/extension/greengpt.zip"
        className="arrow heading3"
        target="_blank"
        rel="noreferrer"
      >
        Try out extension<span className="arrow-right"></span>
      </a>

      <div className='download-container'>
        <h4>How to Install the Extension</h4>
          <ol className="install-steps">
            <li>
              <strong>Download:</strong> <a href="https://cise.ufl.edu/~t.lu/cis4930/extension/greengpt.zip" target="_blank" rel="noreferrer">Click here to download the ZIP</a>
            </li>
            <li><strong>Extract:</strong> Unzip the downloaded file to a folder (e.g., `greengpt`).</li>
            <li><strong>Open Chrome:</strong> Go to <code>chrome://extensions</code></li>
            <li><strong>Enable Developer Mode:</strong> Toggle the switch in the top-right corner.</li>
            <li><strong>Load Unpacked:</strong> Click “Load unpacked”, which should be located in the top-left corner, navigate to the newly unzipped folder, and select the unzipped folder as the folder location.</li>
            <li><strong>Done!</strong> You should now see GreenGPT Token Tracker in your extensions list</li>
          </ol>
      </div>
      </div>     
    </div>
    
  )
}

export default ExtensionInfo
