// --- Music Recommendation AI Chatbot using Gemini Proxy Server ---

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("clear-btn").addEventListener("click", clearChat);
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

// Add message with timestamp
function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");

    const wrapper = document.createElement("div");
    wrapper.classList.add("message", sender);

    const msg = document.createElement("div");
    msg.textContent = text;

    const time = document.createElement("div");
    time.classList.add("timestamp");
    time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    wrapper.appendChild(msg);
    wrapper.appendChild(time);

    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
    document.getElementById("typing-indicator").classList.remove("hidden");
}

function hideTyping() {
    document.getElementById("typing-indicator").classList.add("hidden");
}

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const userText = inputField.value.trim();

    if (userText === "") {
        addMessage("Please type a message first.", "bot");
        return;
    }

    addMessage(userText, "user");
    inputField.value = "";

    showTyping();

    const botReply = await getMusicRecommendation(userText);

    hideTyping();
    addMessage(botReply, "bot");
}

function clearChat() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    addMessage("Chat cleared. Ask me for music recommendations!", "bot");
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    const btn = document.getElementById("theme-toggle");
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// --- Call your local Gemini proxy server ---
async function getMusicRecommendation(userMessage) {
    try {
        const response = await fetch("http://localhost:3000/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        if (data.candidates) {
            return data.candidates[0].content.parts[0].text;
        }

        return "Sorry, Gemini didn't return a response.";
    } catch (error) {
        return "Error contacting Gemini server.";
    }


}
