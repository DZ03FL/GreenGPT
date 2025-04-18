console.log("ChatGPT token tracker script loaded");

(function () {
  console.log("GreenGPT Token Tracker injected");

  let lastPrompt = "";
  let lastResponse = "";
  let lastPayloadHash = "";
  let debounceTimer = null;

  function hashPayload(prompt, response) {
    return `${prompt.slice(0, 100)}::${response.slice(0, 100)}`; 
  }

  function handleChatUpdate() {
    const messages = document.querySelectorAll('[data-message-author-role]');
    const roles = Array.from(messages).map(m => m.getAttribute("data-message-author-role"));

    const lastUserIndex = roles.lastIndexOf("user");
    const lastAssistantIndex = roles.lastIndexOf("assistant");

    if (lastUserIndex === -1 || lastAssistantIndex === -1) return;
    if (lastAssistantIndex <= lastUserIndex) return;

    const user = messages[lastUserIndex]?.innerText.trim();
    const gpt = messages[lastAssistantIndex]?.innerText.trim();

    
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const currentHash = hashPayload(user, gpt);
      if (currentHash === lastPayloadHash) return;

      if (!gpt || gpt.trim().length === 0 || gpt === '​') return;
      
      lastPayloadHash = currentHash;
      lastPrompt = user;
      lastResponse = gpt;

      const promptTokens = estimateTokens(user);
      const responseTokens = estimateTokens(gpt);
      const totalTokens = promptTokens + responseTokens;
      const timestamp = new Date().toISOString();

      const payload = {
        prompt: user,
        response: gpt,
        promptTokens,
        responseTokens,
        totalTokens,
        timestamp
      };

      console.log("[GreenGPT Extension] Token Data:", payload);

      fetch("http://localhost:5000/api/token-usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      fetch("http://localhost:5000/api/energy-estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          timestamp, 
          totalTokens
         })
      })
        .then(res => res.json())
        .then(data => {
          console.log("[GreenGPT Energy Stats]", data);
        });
    }, 1500); 
  }

  function waitForChatContainer(callback) {
    const interval = setInterval(() => {
      const chatContainer = document.querySelector("main");
      if (chatContainer) {
        clearInterval(interval);
        callback(chatContainer);
      }
    }, 500);
  }

  waitForChatContainer((chatContainer) => {
    const observer = new MutationObserver(handleChatUpdate);
    observer.observe(chatContainer, { childList: true, subtree: true });
  });
})();
