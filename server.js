const WebSocket = require('ws');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
        console.log(`Received: ${message}`);
        
        const userMessage = JSON.parse(message);
        const userInput = userMessage.text;

        // Call OpenAI's API to generate a response
        const response = await getChatGPTResponse(userInput);

        // Send the response back to the client
        ws.send(JSON.stringify({
            chatbot: userMessage.chatbot === "C1" ? "C2" : "C1",
            text: response,
        }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to generate a response using OpenAI's API
async function getChatGPTResponse(userInput) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
            max_tokens: 150, // Adjust token limit as necessary
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return 'I encountered an error while generating a response.';
    }
}

console.log('WebSocket server is running on ws://localhost:8080');
