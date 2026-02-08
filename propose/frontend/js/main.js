// API Configuration for local
// const API_URL = 'http://localhost:5000';

// API Configuration for production
const API_URL = 'https://love26.onrender.com';

// State Management
let selectedResponse = '';

// Create floating hearts
function createFloatingHearts() {
    const container = document.querySelector('.hearts-container');
    const heartSymbols = ['💕', '💖', '💗', '💓', '💝'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.opacity = '0';
            heart.style.animation = `float ${Math.random() * 10 + 15}s linear infinite`;
            heart.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(heart);
        }, i * 200);
    }
}

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

// Start on page load
window.onload = () => {
    typeWriter();
    createFloatingHearts();
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

// Toggle Email Field
function toggleEmailField() {
    const checkbox = document.getElementById('send-to-other');
    const emailWrapper = document.getElementById('email-field-wrapper');
    
    if (checkbox.checked) {
        emailWrapper.classList.remove('hidden');
        emailWrapper.style.animation = 'fadeIn 0.5s ease forwards';
        
        // Smooth scroll to email field
        setTimeout(() => {
            emailWrapper.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
    } else {
        emailWrapper.classList.add('hidden');
        document.getElementById('other-email').value = '';
    }
}

// Select Response
function selectResponse(response) {
    selectedResponse = response;
    
    const title = document.getElementById('response-title');
    const subtitle = document.getElementById('response-subtitle');
    
    if (response === 'yes') {
        title.textContent = "You said YES! 💖";
        subtitle.textContent = "Yeh Propose Day mere liye sabse khaas ban gaya! Apne dil ki baat batao…";
    } else if (response === 'no') {
        title.textContent = "I understand 🤍";
        subtitle.textContent = "Shukriya itmaanaan se jawab dene ke liye. Agar kuch kehna ho to bata sakte ho…";
    } else {
        title.textContent = "Take your time 🤔";
        subtitle.textContent = "Koi jaldi nahi hai, jab dil chahe tab batana… Is Propose Day pe bas tumhari khushi chahiye.";
    }
    
    switchScreen('proposal-screen', 'response-screen');
}

// Submit Response to Backend
async function submitResponse() {
    const nameInput = document.getElementById('user-name');
    const messageInput = document.getElementById('user-message');
    const otherEmailInput = document.getElementById('other-email');
    const sendToOtherCheckbox = document.getElementById('send-to-other');
    const submitBtn = document.getElementById('submit-btn');
    
    const name = nameInput.value.trim() || 'Anonymous';
    const message = messageInput.value.trim();
    let otherEmail = null;
    
    // Validation
    if (!message) {
        alert('Please apne dil ki baat likho! 💌');
        return;
    }
    
    // Check if sending to someone else
    if (sendToOtherCheckbox.checked) {
        otherEmail = otherEmailInput.value.trim();
        
        if (!otherEmail) {
            alert('Email address dalein ya checkbox uncheck karein! 📧');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(otherEmail)) {
            alert('Valid email address dalein! 📧');
            return;
        }
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
                message: message,
                otherEmail: otherEmail
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(otherEmail);
        } else {
            throw new Error(data.error || 'Failed to save response');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Kuch galat ho gaya! Please dobara try karein 💔');
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Send Response';
    }
}

// Show Success Screen
function showSuccess(otherEmail) {
    const emoji = document.getElementById('success-emoji');
    const title = document.getElementById('success-title');
    const message = document.getElementById('success-message');
    const emailStatus = document.getElementById('email-status');
    
    if (selectedResponse === 'yes') {
        emoji.textContent = '🎉';
        title.textContent = "Thank you! ❤️";
        message.textContent = "Is Propose Day pe tumne meri zindagi ko sabse pyaara tohfa diya hai!";
        
        // Confetti animation
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff6b9d', '#c23866', '#ffb6c1', '#ffc0cb']
            });
        }, 500);
        
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff6b9d', '#c23866', '#ffb6c1']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff6b9d', '#c23866', '#ffb6c1']
            });
        }, 1000);
        
    } else if (selectedResponse === 'no') {
        emoji.textContent = '🤍';
        title.textContent = "Response Received";
        message.textContent = "Tumhara jawab mil gaya. Shukriya itminaan se batane ke liye.";
    } else {
        emoji.textContent = '💌';
        title.textContent = "Got it!";
        message.textContent = "Jitna waqt chahiye lo, koi jaldi nahi. Bas khush raho! 💕";
    }
    
    // Email status message
    if (otherEmail) {
        emailStatus.textContent = `Email sent to ${otherEmail} (and you got a copy too!)`;
    } else {
        emailStatus.textContent = 'Email notification sent to the special person! 💌';
    }
    
    switchScreen('response-screen', 'success-screen');
}