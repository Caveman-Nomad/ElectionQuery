const geminiService = require('../services/geminiService');

async function handleChat(req, res) {
  try {
    const { messages, stateContext } = req.body;

    // Basic Input Validation for Security
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid messages array." });
    }
    if (!stateContext || typeof stateContext !== 'string') {
      return res.status(400).json({ error: "Invalid state context." });
    }

    const responseText = await geminiService.generateChatResponse(messages, stateContext);
    
    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error("Chat Controller Error:", error);
    
    // Check if it's our explicit API key error
    if (error.message.includes('API key')) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    return res.status(500).json({ error: "An unexpected error occurred while generating response." });
  }
}

module.exports = {
  handleChat
};
