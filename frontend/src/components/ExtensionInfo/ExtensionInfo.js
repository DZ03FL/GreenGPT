import React from 'react'
import './ExtensionInfo.css'

const ExtensionInfo = () => {
  return (
    <div className='extension-container'>
      <img src="/images/chatgpt-logo.png" alt="Extension to track ChatGPT Prompts"></img>
      <div className='description-container'>
      <h3>GreenGPT Extension</h3>
      <h4>ChatGPT Prompt Counter</h4>
      <p>Do you want to spring into action and conserve energy? Download this extension and you will be able to keep track of your energy usage for AI tools!</p>
      <p>
        Track the electricity and water used in the ChatGPT cooling process, saving the world by recognizing how much energy we utilize with AI tools. Visualize ChatGPT energy usage and compete with friends for the title of Most Environmentally Friendly!
      </p>
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
    
  )
}

export default ExtensionInfo
