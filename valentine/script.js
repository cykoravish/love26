// ================================
// Background Music System
// ================================

const musicPlaylist = [
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001685/DIL_KYUN_YE_MERA_K.K._SHUBH_KUMAR_CHOREOGRAPHY_dancecover_kk_dilkyunyehmerashorkare_256KBPS_xjg2nd.webm',
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001663/Tera_Yaar_Hoon_Main_Whatsapp_Status_Tera_Yaar_Hoon_Main_Tom_And_Jerry_Version_Tom_Jerry_Status_256KBPS_cyk11x.webm',
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001660/hua_mai_x_finding_her_kb8cwf.mp3',
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001657/Paresh_Pahuja_s_-_Dooron_Dooron_-_Unplugged_utaqvl.mp3',
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001619/Ve_haniya_song_love_vehaniya_utshorts_lethaldancerofficial_luzkok.mp3',
    'https://res.cloudinary.com/djg26gece/video/upload/v1771001613/Matargashti_khuli_sadak_mein_enjoy_the_music_trendy_status_video_2020_LOW_eyutmd.mp4',
];

let audioPlayer = null;
let isMusicEnabled = false;
let hasInteracted = false;

function initializeMusic() {
    audioPlayer = new Audio();
    audioPlayer.volume = 0.3;
    audioPlayer.loop = false;
    audioPlayer.addEventListener('ended', playRandomSong);
}

function getRandomSong() {
    return musicPlaylist[Math.floor(Math.random() * musicPlaylist.length)];
}

function playRandomSong() {
    if (!isMusicEnabled) return;
    audioPlayer.src = getRandomSong();
    audioPlayer.play().catch(err => console.log('Audio playback failed:', err));
}

function toggleMusic() {
    const musicBtn = document.querySelector('.music-control');
    
    if (!hasInteracted) {
        hasInteracted = true;
        isMusicEnabled = true;
        playRandomSong();
        musicBtn.classList.add('is-playing');
        musicBtn.classList.remove('is-muted');
    } else {
        isMusicEnabled = !isMusicEnabled;
        
        if (isMusicEnabled) {
            audioPlayer.play().catch(err => console.log('Play failed:', err));
            musicBtn.classList.add('is-playing');
            musicBtn.classList.remove('is-muted');
        } else {
            audioPlayer.pause();
            musicBtn.classList.remove('is-playing');
            musicBtn.classList.add('is-muted');
        }
    }
}

// ================================
// Cursor Glow Effect
// ================================

const cursorGlow = document.querySelector('.cursor-glow');

if (window.innerWidth >= 1024) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

// ================================
// Floating Background Hearts
// ================================

function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝'];
    
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 25 + 's';
        heart.style.animationDuration = (20 + Math.random() * 10) + 's';
        heartsContainer.appendChild(heart);
    }
}

// ================================
// Personalization Feature
// ================================

const nameInput = document.getElementById('visitor-name');
const welcomeText = document.querySelector('.welcome-text');

if (nameInput && welcomeText) {
    nameInput.addEventListener('input', (e) => {
        const name = e.target.value.trim();
        
        if (name) {
            welcomeText.textContent = `Swagat hai, ${name} ❤️`;
            welcomeText.classList.add('show');
        } else {
            welcomeText.classList.remove('show');
        }
    });
}

// ================================
// Easter Egg
// ================================

const easterEggHeart = document.querySelector('.easter-egg-heart');
const secretMessage = document.querySelector('.secret-message');
let heartClickCount = 0;

if (easterEggHeart && secretMessage) {
    easterEggHeart.addEventListener('click', (e) => {
        e.stopPropagation();
        heartClickCount++;
        
        easterEggHeart.style.transform = 'scale(1.3)';
        setTimeout(() => {
            easterEggHeart.style.transform = '';
        }, 200);
        
        if (heartClickCount === 5) {
            secretMessage.classList.add('revealed');
            setTimeout(() => {
                secretMessage.classList.remove('revealed');
                heartClickCount = 0;
            }, 5000);
        }
    });
}

// ================================
// Rose Day - Send Rose
// ================================

const roseBtn = document.querySelector('.rose-btn');
const roseMessage = document.querySelector('.rose-message');
const petalsContainer = document.querySelector('.petals-container');

if (roseBtn && roseMessage && petalsContainer) {
    roseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        roseMessage.classList.add('show');
        
        // Create falling petals
        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.textContent = '🌸';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.animationDelay = (Math.random() * 0.5) + 's';
            petalsContainer.appendChild(petal);
            
            setTimeout(() => petal.remove(), 4500);
        }
        
        setTimeout(() => roseMessage.classList.remove('show'), 4000);
    });
}

// ================================
// Propose Day - Yes/No
// ================================

const yesBtn = document.querySelector('.yes-btn');
const noBtn = document.querySelector('.no-btn');
const proposeMessage = document.querySelector('.propose-message');
const heartsContainer = document.querySelector('.hearts-container');

let noClickCount = 0;

if (yesBtn && proposeMessage && heartsContainer) {
    yesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        proposeMessage.textContent = 'Bahut badhiya! 🎉';
        proposeMessage.classList.add('show');
        
        // Create floating hearts
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '💖';
            heart.style.left = (30 + Math.random() * 40) + '%';
            heart.style.top = '50%';
            heart.style.animationDelay = (i * 0.1) + 's';
            heartsContainer.appendChild(heart);
            
            setTimeout(() => heart.remove(), 2500);
        }
        
        yesBtn.style.boxShadow = '0 0 30px rgba(255, 77, 136, 0.6)';
        
        setTimeout(() => {
            proposeMessage.classList.remove('show');
            yesBtn.style.boxShadow = '';
        }, 3000);
    });
}

if (noBtn && proposeMessage) {
    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        noClickCount++;
        
        if (noClickCount < 3) {
            const card = noBtn.closest('.day-card');
            const cardRect = card.getBoundingClientRect();
            
            const randomX = Math.random() * (cardRect.width - noBtn.offsetWidth);
            const randomY = Math.random() * (cardRect.height - noBtn.offsetHeight);
            
            noBtn.style.position = 'absolute';
            noBtn.style.left = randomX + 'px';
            noBtn.style.top = randomY + 'px';
        } else {
            proposeMessage.textContent = 'Khushi se bhaag nahi sakte! 😌';
            proposeMessage.classList.add('show');
            noBtn.style.display = 'none';
            
            setTimeout(() => {
                proposeMessage.classList.remove('show');
                noBtn.style.display = '';
                noBtn.style.position = '';
                noClickCount = 0;
            }, 3000);
        }
    });
}

// ================================
// Chocolate Day - Unwrap
// ================================

const chocolateBox = document.querySelector('.chocolate-box');
const chocolateMsg = document.querySelector('.chocolate-msg');

if (chocolateBox && chocolateMsg) {
    chocolateBox.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (!chocolateBox.classList.contains('opened')) {
            chocolateBox.classList.add('opened');
            setTimeout(() => {
                chocolateMsg.textContent = 'Zindagi chocolate jaisi hai — doston ke saath aur mithhi! 🍫';
            }, 500);
            
            setTimeout(() => {
                chocolateBox.classList.remove('opened');
                chocolateMsg.textContent = '';
            }, 5000);
        }
    });
}

// ================================
// Teddy Day - Hover Effect
// ================================

const teddyEmoji = document.querySelector('.teddy-emoji');

if (teddyEmoji) {
    teddyEmoji.addEventListener('mouseenter', () => {
        teddyEmoji.style.transform = 'scale(1.2)';
    });
    
    teddyEmoji.addEventListener('mouseleave', () => {
        teddyEmoji.style.transform = '';
    });
}

// ================================
// Promise Day - Dynamic Message
// ================================

const promiseChecks = document.querySelectorAll('.promise-check');
const promiseMessage = document.querySelector('.promise-message');

if (promiseChecks.length > 0 && promiseMessage) {
    promiseChecks.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checkedCount = Array.from(promiseChecks).filter(cb => cb.checked).length;
            
            if (checkedCount > 0) {
                let message = '';
                
                if (checkedCount === 1) {
                    message = 'Ek promise sab badal sakta hai! 💫';
                } else if (checkedCount === 2) {
                    message = 'Do vaade — mazboot rishta! 💪';
                } else {
                    message = 'Teen vaade! Tum best ho! 🌟';
                }
                
                promiseMessage.textContent = message;
                promiseMessage.classList.add('show');
            } else {
                promiseMessage.classList.remove('show');
            }
        });
    });
}

// ================================
// Hug Day - Hug Animation
// ================================

const hugBtn = document.querySelector('.hug-btn');
const hugAvatars = document.querySelector('.hug-avatars');
const hugMessage = document.querySelector('.hug-message');

if (hugBtn && hugAvatars && hugMessage) {
    hugBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hugAvatars.classList.add('hugging');
        hugMessage.textContent = 'Jhappi = Pyaar 🤗';
        hugMessage.classList.add('show');
        
        setTimeout(() => {
            hugAvatars.classList.remove('hugging');
            hugMessage.classList.remove('show');
        }, 3000);
    });
}

// ================================
// Kiss Day - Click Effects
// ================================

const kissCanvas = document.querySelector('.kiss-canvas');
const kissSymbols = ['💋', '❤️', '💕', '💖', '💗'];

if (kissCanvas) {
    kissCanvas.addEventListener('click', (e) => {
        const rect = kissCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const symbol = Math.random() > 0.5 ? '💋' : kissSymbols[Math.floor(Math.random() * kissSymbols.length)];
        
        const element = document.createElement('div');
        element.className = Math.random() > 0.5 ? 'kiss-mark' : 'kiss-heart';
        element.textContent = symbol;
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        kissCanvas.appendChild(element);
        
        setTimeout(() => element.remove(), 2000);
    });
}

// ================================
// Touch Support for Mobile
// ================================

const allButtons = document.querySelectorAll('.day-btn, .music-control');
allButtons.forEach(button => {
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.click();
    }, { passive: false });
});

// ================================
// Initialize Everything
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c💖 7 Days of Pyaar & Dosti - Single Screen Edition 💖', 
        'font-size: 18px; font-weight: bold; color: #ff4d88;');
    
    initializeMusic();
    createFloatingHearts();
    
    const musicBtn = document.querySelector('.music-control');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
    
    console.log('✨ Sab kuch ready hai! ✨');
});

// ================================
// Prevent Card Click Bubbling
// ================================

document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Allow clicks on interactive elements
        if (e.target.closest('button, input, .chocolate-box, .kiss-canvas')) {
            return;
        }
    });
});
