// Chat Widget JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat window
    chatToggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        chatToggleBtn.classList.toggle('active');
        
        // Focus on input when chat opens
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Close chat window
    chatCloseBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        chatToggleBtn.classList.remove('active');
    });

    // Send message on button click
    chatSendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 80) + 'px';
    });

    function sendMessage() {
        const message = chatInput.value.trim();

        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Scroll to bottom
        scrollToBottom();

        // Simulate bot typing and response
        setTimeout(() => {
            addBotResponse();
        }, 800);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);
    }

    function addBotResponse() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        
        // Create the response with email button
        bubble.innerHTML = `
            <div>
                <p style="margin: 0 0 8px 0; font-size: 14px;">We are currently attending to some Customers. Send an Email to <strong>help@carrafoxmassages.com</strong></p>
                <a href="mailto:help@carrafoxmassages.com" class="email-button">
                    <i class="ri-mail-line" style="margin-right: 6px;"></i>Send a Mail
                </a>
            </div>
        `;

        messageDiv.appendChild(bubble);
        chatMessages.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 0);
    }
});
