const API_KEY = 'AIzaSyBItj8RUKJj3rh7ihoOcoZnhhaNT_VZIqI'; // Ganti dengan API key Anda
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Tampilkan pesan pengguna
    addMessage(message, 'user');
    userInput.value = '';

    // Tampilkan indikator typing
    showTypingIndicator();

    // Kirim permintaan ke Gemini API
    fetchGeminiResponse(message);
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    if (sender === 'ai') {
        const typingTextElement = document.createElement('span');
        typingTextElement.classList.add('typing-text');
        messageElement.appendChild(typingTextElement);
        
        // Animasi ketik
        animateTyping(typingTextElement, text);
    } else {
        messageElement.textContent = text;
    }
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function animateTyping(element, text, index = 0) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => {
            animateTyping(element, text, index + 1);
        }, 20); // Kecepatan ketik (makin kecil makin cepat)
    }
}

function showTypingIndicator() {
    // Hapus indikator typing sebelumnya jika ada
    const existingIndicator = chatContainer.querySelector('.typing-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = chatContainer.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function fetchGeminiResponse(prompt) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Hapus indikator typing
        removeTypingIndicator();
        
        // Tambahkan respons AI
        addMessage(aiResponse, 'ai');
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Maaf, terjadi kesalahan.', 'ai');
    }
}

function cleanMessage(text) {
    // Hapus asterisk di awal
    text = text.replace(/^\*+\s*/, '');
    
    // Opsional: Proses markdown sederhana
    text = text
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Coret
        .replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    return text;
}

function addMessage(text, sender) {
    // Bersihkan dan proses teks
    const processedText = cleanMessage(text);

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    // Gunakan teks yang sudah diproses
    messageElement.innerHTML = sanitizeHTML(processedText);
    
    chatContainer.appendChild(messageElement);
    
    // Efek transisi
    setTimeout(() => {
        messageElement.classList.add('visible');
    }, 10);
    
    // Scroll ke bawah
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

function animateTyping(element, text, index = 0) {
    if (index < text.length) {
        // Gunakan innerHTML untuk mendukung tag HTML
        element.innerHTML = formatText(text.slice(0, index + 1));
        setTimeout(() => {
            animateTyping(element, text, index + 1);
        }, 20); // Kecepatan ketik (makin kecil makin cepat)
    }
}

function sanitizeHTML(text) {
    // Mengganti karakter-karakter khusus HTML dengan entitas HTML
    const div = document.createElement('div');
    div.innerText = text; // Menggunakan innerText untuk secara otomatis mengonversi ke entitas
    return div.innerHTML;
}

function formatText(text) {
    // Fungsi untuk memformat teks dengan *bold*
    // Pertama, sanitasi teks untuk menghindari eksekusi HTML
    const sanitizedText = sanitizeHTML(text);
    return sanitizedText.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    if (sender === 'ai') {
        const typingTextElement = document.createElement('span');
        typingTextElement.classList.add('typing-text');
        messageElement.appendChild(typingTextElement);
        
        // Tambahkan parsing HTML untuk teks
        typingTextElement.innerHTML = formatText(text);
        
        // Animasi ketik
        animateTyping(typingTextElement, text);
    } else {
        messageElement.innerHTML = formatText(text); // Gunakan innerHTML untuk menampilkan teks yang diformat
    }
    
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function animateTyping(element, text, index = 0) {
    if (index < text.length) {
        // Gunakan innerHTML untuk mendukung tag HTML
        element.innerHTML = formatText(text.slice(0, index + 1));
        setTimeout(() => {
            animateTyping(element, text, index + 1);
        }, 20); // Kecepatan ketik (makin kecil makin cepat)
    }
}


