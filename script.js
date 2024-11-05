const form = document.querySelector('.input-form');
const chatContainer = document.querySelector('.chat-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = form.querySelector('input').value;
    addMessage(userMessage); // Pesan pengguna
    form.reset();

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyBItj8RUKJj3rh7ihoOcoZnhhaNT_VZIqI', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: userMessage }] }]
        }),
    });

    const data = await response.json();
    const botMessage = data.candidates[0].content.parts[0].text;
    addMessage(botMessage, true); // Pesan bot
});

function addMessage(message, isBot = false) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = isBot ? `<strong>Hengki Bot:</strong> ${message}` : `<strong>You:</strong> ${message}`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}