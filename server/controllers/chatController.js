const geminiService = require('../services/geminiService');

/**
 * Handles the incoming chat request from the client.
 * Validates input, interacts with the Gemini Service, and returns the response.
 *
 * @async
 * @param {import('express').Request} req - The Express request object containing messages and stateContext in the body.
 * @param {import('express').Response} res - The Express response object used to send back the JSON response.
 * @returns {Promise<void>} Sends a JSON response with the AI text or an error message.
 */
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
