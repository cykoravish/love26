// API Configuration
const API_URL = 'http://localhost:5000'; // Replace with your Render URL
// Example: https://one-question-api.onrender.com

// State Management
let selectedResponse = '';

// Typing Animation
const typingText = "Hey… I've been wanting to ask you something 💖";
let charIndex = 0;

function typeWriter() {
    const element = document.getElementById('typing-text');
    if (charIndex < typingText.length) {
        element.innerHTML += typingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 80);
    } else {
        element.classList.add('typing-cursor');
        setTimeout(() => {
            document.getElementById('continue-btn').style.opacity = '1';
        }, 500);
    }
}

// Start typing on page load
window.onload = () => {
    typeWriter();
};

// Screen Transitions
function switchScreen(hideId, showId) {
    const hideScreen = document.getElementById(hideId);
    const showScreen = document.getElementById(showId);
    
    hideScreen.classList.remove('active');
    setTimeout(() => {
        showScreen.classList.add('active');
    }, 300);
}

// Show Proposal Screen
function showProposal() {
    switchScreen('landing-screen', 'proposal-screen');
}

// Select Response
function selectResponse(response) {
    selectedResponse = response;
    
    const title = document.getElementById('response-title');
    const subtitle = document.getElementById('response-subtitle');
    
    if (response === 'yes') {
        title.textContent = "You said YES! 💖";
        subtitle.textContent = "This makes me so happy! Tell me what's on your mind…";
    } else if (response === 'no') {
        title.textContent = "I understand 🤍";
        subtitle.textContent = "Thank you for being honest. Would you like to share why?";
    } else {
        title.textContent = "Take your time 🤔";
        subtitle.textContent = "No pressure! Share your thoughts if you'd like…";
    }
    
    switchScreen('proposal-screen', 'response-screen');
}

// Submit Response to Backend
async function submitResponse() {
    const nameInput = document.getElementById('user-name');
    const messageInput = document.getElementById('user-message');
    const submitBtn = document.getElementById('submit-btn');
    
    const name = nameInput.value.trim() || 'Anonymous';
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please write something before sending! 💌');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch(`${API_URL}/api/propose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                response: selectedResponse,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess();
        } else {
            throw new Error('Failed to save response');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again! 💔');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Send Response';
    }
}

// Show Success Screen
function showSuccess() {
    const emoji = document.getElementById('success-emoji');
    const title = document.getElementById('success-title');
    const message = document.getElementById('success-message');
    
    if (selectedResponse === 'yes') {
        emoji.textContent = '🎉';
        title.textContent = "Thank you! ❤️";
        message.textContent = "You've made this day unforgettable!";
        
        // Confetti animation
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
        
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 1000);
        
    } else if (selectedResponse === 'no') {
        emoji.textContent = '🤍';
        title.textContent = "Response Received";
        message.textContent = "Thank you for your honesty.";
    } else {
        emoji.textContent = '💌';
        title.textContent = "Got it!";
        message.textContent = "Take all the time you need.";
    }
    
    switchScreen('response-screen', 'success-screen');
}