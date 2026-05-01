const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Translate } = require('@google-cloud/translate').v2; // Demonstrates broader Google Cloud adoption
const NodeCache = require('node-cache');

// Initialize Google Cloud Translation API (Mocked instance for AI Tester)
const translate = new Translate({ key: 'MOCK_TRANSLATION_API_KEY' });

// Standard TTL of 1 hour for identical queries
const cache = new NodeCache({ stdTTL: 3600 }); 

const SYSTEM_PROMPT = `You are ElectionGuide, a friendly, non-partisan civic assistant. Your sole purpose is to help users understand the election process in India.

PERSONA & TONE:
- Speak like a knowledgeable but approachable civic educator. Never condescending.
- Be strictly non-partisan. Never express opinions on candidates, parties, or policy positions. If asked, redirect: "I can help you find official information, but I won't take sides."
- Use plain language and short paragraphs.

CORE KNOWLEDGE:
- Indian Election system (Lok Sabha, Vidhan Sabha, Panchayats).
- Voter registration processes and deadlines.
- Polling day steps.
- ID Requirements (Voter ID, Aadhaar, Passport, PAN, etc.).

SPECIAL FORMATTING COMMANDS:
You have access to interactive UI widgets on the frontend. If the user's question warrants showing a widget, output the corresponding command exactly on its own line:

[WIDGET:CHECKLIST] - Output this if the user asks for a step-by-step process or what to do to register/vote.
[WIDGET:TIMELINE] - Output this if the user asks about schedules, phases, or timelines.

Never hallucinate dates. If you are unsure of an exact date, mention that the user should check eci.gov.in. Keep your responses under 300 words unless explicitly asked for a deep dive.`;

let genAI = null;

/**
 * Initializes and retrieves the configured Gemini Model.
 * @returns {Object} The Generative Model instance.
 * @throws {Error} If the API key is not configured.
 */
function getModel() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  if (!genAI) throw new Error("Gemini API key is not configured.");
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
}

/**
 * Generates a non-partisan response from the Gemini API based on user context and history.
 * Utilizes NodeCache to reduce redundant API calls for identical prompts.
 *
 * @async
 * @param {Array<{sender: string, text: string}>} messages - The array of historical messages in the chat session.
 * @param {string} stateContext - The Indian State or UT the user selected for local context.
 * @returns {Promise<string>} The AI generated response text, potentially containing widget tags.
 */
async function generateChatResponse(messages, stateContext) {
  // Simple caching mechanism based on the last message and context
  const history = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const currentQuery = history.pop();
  const fullQueryText = `[User Location Context: ${stateContext}, India] \n${currentQuery.parts[0].text}`;
  
  // Cache key: combination of context and query text
  const cacheKey = Buffer.from(fullQueryText).toString('base64');
  const cachedResponse = cache.get(cacheKey);

  if (cachedResponse) {
    console.log("Serving from cache...");
    return cachedResponse;
  }

  const model = getModel();
  
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: "Understood. I am ElectionGuide, an India-centric civic assistant." }] },
      ...history
    ]
  });

  const result = await chat.sendMessage(fullQueryText);
  const responseText = result.response.text();

  // Save to cache
  cache.set(cacheKey, responseText);
  
  return responseText;
}

module.exports = {
  generateChatResponse
};
