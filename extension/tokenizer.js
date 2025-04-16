
function estimateTokens(text) {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words * 0.75); // Rough GPT token estimate
  }
  