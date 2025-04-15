console.log("ChatGPT token tracker script loaded");

(function() {
    console.log("GreenGPT Token Tracker injected");
  
    const observer = new MutationObserver(() => {
      const messages = document.querySelectorAll('[data-message-author-role]');
      if (messages.length >= 2) {
        const lastTwo = Array.from(messages).slice(-2);
        const user = lastTwo[0]?.innerText || "";
        const gpt = lastTwo[1]?.innerText || "";
  
        const promptTokens = estimateTokens(user);
        const responseTokens = estimateTokens(gpt);
        const totalTokens = promptTokens + responseTokens;
  
        const payload = {
          prompt: user,
          response: gpt,
          promptTokens,
          responseTokens,
          totalTokens,
          timestamp: new Date().toISOString()
        };
  
        console.log("[GreenGPT Extension] Token Data:", payload);
  
        fetch("http://localhost:5000/api/token-usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }
    });
  
    const chatContainer = document.querySelector("main");
    if (chatContainer) {
      observer.observe(chatContainer, { childList: true, subtree: true });
    }
  })();
  