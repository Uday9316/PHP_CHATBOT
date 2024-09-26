document.addEventListener('DOMContentLoaded', function () {
    const chatHistory = document.querySelector('.msg_history');
    const sendButton = document.querySelector('.msg_send_btn');
    const messageInput = document.querySelector('.write_msg');

    // Auto-scroll to the latest message
    if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    if (sendButton && messageInput) {
        sendButton.addEventListener('click', function () {
            sendMessage();
        });

        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // Append the new message to the chat history
            appendMessage({
                message: message,
                formatted_date: new Date().toLocaleDateString(),
                formatted_time: new Date().toLocaleTimeString(),
                self: true,
                user_name: 'Urvish'
            });

            // Clear the input field and scroll to the latest message
            messageInput.value = '';
            chatHistory.scrollTop = chatHistory.scrollHeight;

            // Send the message to the server
            fetch('fetchmessages.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `message=${encodeURIComponent(message)}&username=Urvish`,
            })
            .then((response) => response.text())
            .then((data) => {
                console.log(data);
                // Fetch new messages after sending
                fetchMessages();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }

    function appendMessage(msg) {
        const userName = msg.self ? '' : `<span class="username-display">${msg.user_name}</span>`;
        const msgClass = msg.self ? 'outgoing_msg' : 'incoming_msg';
        const innerMsgClass = msg.self ? 'sent_msg' : 'received_msg';
        const newMessage = document.createElement('div');
        newMessage.classList.add(msgClass);
        newMessage.innerHTML = `
            <div class="${innerMsgClass}">
                ${userName}
                <p>${msg.message}</p>
                <span class="time_date">${msg.formatted_time} | ${msg.formatted_date}</span>
            </div>
        `;
        chatHistory.appendChild(newMessage);
    }

    function fetchMessages() {
        fetch('fetchmessages.php')
            .then((response) => response.json())
            .then((data) => {
                chatHistory.innerHTML = ''; // Clear current messages
                data.messages.forEach(msg => {
                    appendMessage(msg);
                });
                chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the latest message
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    // Initial fetch of old messages
    fetchMessages();
});
