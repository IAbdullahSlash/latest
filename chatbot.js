// chatbot.js
const API_KEY = "AIzaSyCqc3zIUa59r7UvNbn7gy6rhRXbsZ6NcxE"; // **REPLACE WITH YOUR ACTUAL API KEY**
const MODEL_NAME = "gemini-1.5-flash";  // Correct model name
const GENERATION_CONFIG = {
    temperature: 0.25,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 8192,
    // response_mime_type: "text/plain",  // No longer needed for the correct approach
};

const SYSTEM_INSTRUCTION = "your name is SafeBrowse you are an AI agent who is responsible for detecting and recognizing harmful content, including misinformation, hate speech, and cyberbullying, from given data, and should highlight such content, provide corrections, and suggest appropriate actions accordingly, also you are made by the team 404 fixers, if data has been given with the intension not related to your main mission you should just explain why its not from your expertise.";

const chatContainer = document.querySelector(".chat-messages");
const chatInput = document.querySelector("#chatInput");
const chatForm = document.querySelector("#chatForm");

let history = [];

async function sendMessage(message) {
    try {
        const prompt = {
            parts: [{ text: SYSTEM_INSTRUCTION }, ...history.flatMap(turn => turn.parts), { text: `user: ${message}` }]
        };

        const response = await fetch(`https://api.google.com/generativeai/v1/models/${MODEL_NAME}:generateContent`, { // Correct endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                generationConfig: GENERATION_CONFIG,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Try to get error details from the API
            throw new Error(`Gemini API error: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        const responseText = data.candidates[0].content.parts[0].text; // Access the response correctly

        history.push({ role: "user", parts: [{ text: message }] });
        history.push({ role: "model", parts: [{ text: responseText }] });

        const chatMessage = document.createElement("div");
        chatMessage.classList.add("message");
        chatMessage.classList.add("receiver-message");
        chatMessage.innerHTML = `SB: <br>${responseText}`;
        chatContainer.appendChild(chatMessage);

        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error("Error sending message:", error);
        // Handle the error in the UI, e.g., display an error message to the user
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("message", "error-message"); // Add a CSS class for styling
        errorMessage.textContent = "Error sending message. Please try again later.";
        chatContainer.appendChild(errorMessage);
    }
}


chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (message) {
        const userMessage = document.createElement("div");
        userMessage.classList.add("message");
        userMessage.classList.add("sender-message");
        userMessage.innerHTML = `You: <br>${message}`;
        chatContainer.appendChild(userMessage);
        sendMessage(message);
        chatInput.value = "";
    }
});