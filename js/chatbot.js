// Chatbot Elements
const chatContainer = document.getElementById('chatbot-container');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('chat-loading-indicator');
const chatIcon = document.getElementById('chat-icon');
const closeIcon = document.getElementById('close-icon');
let isChatOpen = false;
const apiKey = ""; // Optional: Your Gemini API key

// Toggle Chat Window
function toggleChat() {
  isChatOpen = !isChatOpen;
  chatContainer.classList.toggle('active', isChatOpen);
  chatIcon.classList.toggle('hidden', isChatOpen);
  closeIcon.classList.toggle('hidden', !isChatOpen);
  if (isChatOpen) userInput.focus();
}

// Display Message
function displayMessage(text, sender, sources = []) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message-box', sender === 'user' ? 'user-message' : 'bot-message', 'shadow-sm');
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br>');
  msgDiv.innerHTML = formatted;
  if (sender === 'bot' && sources.length > 0) {
    const srcDiv = document.createElement('div');
    srcDiv.classList.add('citation');
    srcDiv.innerHTML = '***Sources:*** ' + sources.map(s =>
      `<a href="${s.uri}" target="_blank" class="text-indigo-500 hover:underline">${s.title.substring(0, 50)}...</a>`
    ).join(' | ');
    msgDiv.appendChild(srcDiv);
  }
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fetch API Helper
async function fetchWithBackoff(payload, retries = 3) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
      if (res.status === 429 && i < retries - 1) {
        await new Promise(r => setTimeout(r, delay)); delay *= 2; continue;
      }
      throw new Error(`API error: ${res.statusText}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay)); delay *= 2;
    }
  }
}

// Send Message
async function sendMessage() {
  const query = userInput.value.trim();
  if (!query) return;

  displayMessage(query, 'user');
  userInput.value = '';
  userInput.disabled = true;
  sendButton.disabled = true;
  loadingIndicator.style.display = 'block';

  const payload = {
    contents: [{ parts: [{ text: query }] }],
    tools: [{ "google_search": {} }],
    systemInstruction: {
      parts: [{ text: "You are a helpful AI assistant for a decentralized AGI platform called Sentient. Cite your sources when using search." }]
    }
  };

  try {
    const result = await fetchWithBackoff(payload);
    const candidate = result.candidates?.[0];
    let text = candidate?.content?.parts?.[0]?.text || "No response.";
    let sources = candidate?.groundingMetadata?.groundingAttributions?.map(a => ({
      uri: a.web?.uri,
      title: a.web?.title || 'Untitled'
    })).filter(s => s.uri) || [];
    displayMessage(text, 'bot', sources);
  } catch (err) {
    displayMessage("Error: " + err.message, 'bot');
  } finally {
    userInput.disabled = false;
    sendButton.disabled = false;
    loadingIndicator.style.display = 'none';
    userInput.focus();
  }
}
