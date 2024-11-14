const CHATBOT_1_API_KEY = "AIzaSyB3aSwoPIg6pkNfeEMMJEi9eUxpjy0gdm8";
const CHATBOT_2_API_KEY = "AIzaSyB3aSwoPIg6pkNfeEMMJEi9eUxpjy0gdm8";

async function startConversation() {
    const userPrompt = document.getElementById("user-prompt").value;

    if (userPrompt.trim() === "") return; // Prevent empty prompts

    const chatOutput = document.getElementById("chat-output");

    // Generate Chatbot 1's initial response
    addMessageToChat("C1", "bubble1", "Chatbot 1 is thinking...", "left");

    // Call Chatbot 1 API
    const chatbot1Response = await getChatbotResponse(userPrompt, CHATBOT_1_API_KEY);
    updateLastMessage("C1", "bubble1", `Chatbot 1: ${chatbot1Response}`);

    // Generate Chatbot 2's initial response
    addMessageToChat("C2", "bubble2", "Chatbot 2 is analyzing...", "right");

    // Call Chatbot 2 API
    const chatbot2Response = await getChatbotResponse(chatbot1Response, CHATBOT_2_API_KEY);
    updateLastMessage("C2", "bubble2", `Chatbot 2: ${chatbot2Response}`);

    // Final response based on both chatbot interactions
    generateFinalConclusion(userPrompt);
    
    // Clear input field after message
    document.getElementById("user-prompt").value = "";
}

async function getChatbotResponse(prompt, apiKey) {
    try {
        const response = await fetch("https://api.example.com/chatbot", { // Replace with your actual API URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response; // Adjust based on actual API response structure
    } catch (error) {
        console.error("Error fetching response from chatbot:", error);
        return "Error fetching response from chatbot.";
    }
}

function addMessageToChat(chatbot, bubbleClass, messageText, position) {
    const chatOutput = document.getElementById("chat-output");

    // Create the message container
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (position === "right") {
        messageDiv.classList.add("right");
    }

    // Create avatar
    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar");
    if (chatbot === "C2") {
        avatarDiv.classList.add("avatar2");
    }
    avatarDiv.textContent = chatbot;

    // Create message bubble
    const bubbleDiv = document.createElement("div");
    bubbleDiv.classList.add("bubble", bubbleClass);
    bubbleDiv.textContent = messageText;

    // Append avatar and bubble to the message container
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(bubbleDiv);

    // Append message to the chat output
    chatOutput.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function updateLastMessage(chatbot, bubbleClass, messageText) {
    const chatOutput = document.getElementById("chat-output");
    const lastMessage = chatOutput.lastChild;

    if (lastMessage) {
        const bubbleDiv = lastMessage.querySelector(".bubble");
        bubbleDiv.textContent = messageText;
    }
}

function generateFinalConclusion(userPrompt) {
    const finalOutputText = document.getElementById("final-output-text");
    finalOutputText.textContent = `Final Conclusion: Based on the analysis of "${userPrompt}", both chatbots agree on the importance of understanding multiple perspectives.`;
}
