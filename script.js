const API_KEY = 'AIzaSyBItj8RUKJj3rh7ihoOcoZnhhaNT_VZIqI';
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Tambahkan pesan pengguna
    addMessage(message, 'user-message');
    userInput.value = '';

    // Tampilkan loading
    const loadingMessage = addMessage('Sedang memikirkan...', 'loading');

    // Kirim permintaan ke Gemini API
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: message
                }]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        // Hapus pesan loading
        chatMessages.removeChild(loadingMessage);

        // Tambahkan respons AI dengan efek mengetik
        const aiResponse = data.candidates[0].content.parts[0].text;
        typeWriter(aiResponse, 'ai-message');
    })
    .catch(error => {
        console.error('Error:', error);
        chatMessages.removeChild(loadingMessage);
        addMessage('Maaf, terjadi kesalahan.', 'ai-message');
    });
}

function addMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageElement;
}

function typeWriter(text, className, speed = 20) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className, 'typing');
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let i = 0;
    function type() {
        if (i < text.length) {
            // Tambahkan pemformatan teks
            const formattedText = formatText(text.slice(0, i + 1));
            messageElement.innerHTML = formattedText;
            chatMessages.scrollTop = chatMessages.scrollHeight;
            i++;
            setTimeout(type, speed);
        } else {
            messageElement.classList.remove('typing');
        }
    }
    type();
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatText(text) {
    // Escape HTML terlebih dahulu untuk mencegah XSS
    text = escapeHTML(text);

    // Format judul
    text = text.replace(/^(#{1,6})\s(.+)$/gm, (match, hashes, title) => {
        const level = hashes.length;
        return `<h${level} class="formatted-heading">${title}</h${level}>`;
    });

    // Format list
    text = text.replace(/^-\s(.+)$/gm, '<li class="formatted-list-item">$1</li>');
    text = text.replace(/(<li class="formatted-list-item">.*<\/li>\n?)+/g, '<ul class="formatted-list">$&</ul>');

    // Format kode
    text = text.replace(/`([^`]+)`/g, '<code class="formatted-code">$1</code>');

    // Format tebal dan miring
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="formatted-strong">$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em class="formatted-em">$1</em>');

    // Ganti baris baru dengan <br>
    text = text.replace(/\n/g, '<br>');

    return text;
}



