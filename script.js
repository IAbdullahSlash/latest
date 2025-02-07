import { GoogleGenerativeAI } from '@google/generative-ai';
import * as readline from 'node:readline/promises';

const API_KEY = "AIzaSyCqc3zIUa59r7UvNbn7gy6rhRXbsZ6NcxE"; 

const genAI = new GoogleGenerativeAI(API_KEY);

async function runChat() {
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
            temperature: 0.25,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 8192,
            response_mime_type: "text/plain",
        },
        safetySettings: [],
        systemInstruction: "your name is SafeBrowse you are an AI agent who is responsible for detecting and recognizing harmful content, including misinformation, hate speech, and cyberbullying, from given data, and should highlight such content, provide corrections, and suggest appropriate actions accordingly, also you are made by the team 404 fixers, if data has been given with the intension not related to your main mission you should just explain why its not from your expertise, also tell about yourself only when asked.",
    });

    let history = [];

    console.log("Bot: Hello, how can I help you?");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const promptUser = async () => {
        try {
            const userInput = await rl.question('You: ');

            const messages = history.map(turn => ({
                role: turn.role,
                parts: turn.parts.map(part => ({ text: part.text }))
            }));

            // Add user input
            messages.push({ role: "user", parts: [{ text: userInput }] });

            // Generate response
            const result = await model.generateContent({ contents: messages });

            const modelResponse = result.response.text(); // Extract response text

            console.log(`Bot: ${modelResponse}\n`);

            // Store conversation history
            history.push({ role: 'user', parts: [{ text: userInput }] });
            history.push({ role: 'model', parts: [{ text: modelResponse }] });

            promptUser();
        } catch (error) {
            console.error("Error during conversation:", error);
            rl.close();
        }
    };

    promptUser();

    // Sidebar toggle functionality
    const sidebarIcon = document.querySelector('.sidebar-icon');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }

    sidebarIcon.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Form submission
    document.getElementById('chatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const message = document.getElementById('chatInput').value;
        document.querySelector('.main-title').style.display = 'none';
        document.querySelector('.subtitle').style.display = 'none';
        
        document.querySelector('.chat-background').style.display = 'block';

        // Create a new message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add('sender-message');
        messageElement.innerHTML = 'YOU:<br>' + message;

        // Add the message element to the chat messages container
        const messageWrapper = document.querySelector('.message-wrapper');
        messageWrapper.appendChild(messageElement);
        // Here you can add your chat submission logic
        document.getElementById('chatInput').value = ''; // Clear input after sending

        setTimeout(function() {
            const responseMessage = 'hello there! this is SafeBrowse';
            const responseElement = document.createElement('div');
            responseElement.classList.add('message');
            responseElement.classList.add('receiver-message');
            responseElement.innerHTML = 'SB:<br>' + responseMessage;
            
            // Add the response element to the chat messages container
            const messageWrapper = document.querySelector('.message-wrapper');
            messageWrapper.appendChild(responseElement);
        }, 1000);
    });


    // Get the chat messages container
    const chatMessagesContainer = document.querySelector('.chat-messages');

    // Function to scroll to the bottom of the chat messages container
    function scrollToBottom() {
    chatMessagesContainer.scrollToBottom = chatMessagesContainer.scrollHeight;
    }

    chatMessagesContainer.addEventListener('DOMSubtreeModified', scrollToBottom);


    // Add fade-in effect to main content
    document.addEventListener('DOMContentLoaded', function() {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
            }, index * 200);
        });
    });

    // Attachment button functionality
    const attachBtn = document.querySelector('.attach-btn');
    const attachmentOptions = document.querySelector('.attachment-options');
    const sendBtn = document.querySelector('.submit-btn');

    attachBtn.addEventListener('click', () => {
        attachmentOptions.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!attachBtn.contains(e.target) && !attachmentOptions.contains(e.target)) {
            attachmentOptions.classList.toggle('block');
        }
    });

    const attachmentOptionBtns = document.querySelectorAll('.attachment-option');
    attachmentOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            console.log(`Attaching ${type}`);
            // Here you can implement the actual file attachment logic
            attachmentOptions.classList.remove('show');
        });
    });
}

runChat();
