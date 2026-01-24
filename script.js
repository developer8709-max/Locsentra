const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const BOT_MSGS = [
  "Hi, how are you? 😊",
  "📍 Say 'location' to share your GPS coordinates",
  "🤖 I am powered by ChatGPT 4 & advanced AI",
  "😴 I feel sleepy! Need some coffee ☕",
  "🎉 Great to chat with you!",
  "💬 What can I help you with today?",
  "🚀 Let's make this conversation amazing!",
  "🌟 You're awesome! Keep shining ✨"
];

// Enhanced Icons with fallback
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "🤖 HackerAI";
const PERSON_NAME = "💻 User";

// 🌍 LOCATION ACCESS INTEGRATED
let userLocation = null;

function requestLocation() {
  if (!navigator.geolocation) {
    appendMessage(BOT_NAME, BOT_IMG, "left", "❌ Geolocation not supported in this browser");
    return;
  }

  // Show typing first
  showTypingIndicator("left");
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude.toFixed(6),
        lng: position.coords.longitude.toFixed(6),
        accuracy: Math.round(position.coords.accuracy),
        timestamp: new Date().toLocaleString()
      };
      
      const locationMsg = `
        ✅ **Location Acquired!**
        📍 **Lat:** ${userLocation.lat}
        📍 **Lng:** ${userLocation.lng} 
        🎯 **Accuracy:** ${userLocation.accuracy}m
        ⏰ **Time:** ${userLocation.timestamp}
        
        🔗 [Google Maps Link](https://maps.google.com/?q=${userLocation.lat},${userLocation.lng})
      `;
      
      setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", locationMsg);
      }, 1200);
    },
    (error) => {
      let errorMsg;
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = "🚫 Location access denied by user";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "📡 GPS signal unavailable";
          break;
        case error.TIMEOUT:
          errorMsg = "⏰ Location request timed out";
          break;
        default:
          errorMsg = "❌ Location error occurred";
      }
      setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", errorMsg);
      }, 1200);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value.trim().toLowerCase();
  if (!msgText) return;
  
  // Check for location command
  if (msgText.includes('location') || msgText.includes('gps') || msgText.includes('where')) {
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    requestLocation();
    return;
  }
  
  // Add typing effect for regular messages
  showTypingIndicator("right");
  setTimeout(() => {
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgerInput.value);
    msgerInput.value = "";
    botResponse();
  }, 800);
});

function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg" data-name="${name}">
      <div class="msg-img" style="background-image: url(${img})" data-side="${side}">
        <div class="avatar-status ${side === 'left' ? 'bot-status' : 'user-status'}"></div>
      </div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">
          <span class="msg-text-inner">${text}</span>
          <div class="msg-reaction">
            <span class="reaction-btn">📍</span>
            <span class="reaction-btn">❤️</span>
            <span class="reaction-btn">😂</span>
          </div>
        </div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  
  msgerChat.scrollTo({
    top: msgerChat.scrollHeight,
    behavior: 'smooth'
  });
  
  if (side === "right") {
    setTimeout(() => {
      const lastMsg = msgerChat.lastElementChild;
      lastMsg.classList.add('msg-read');
    }, 1000);
  }
}

function showTypingIndicator(side) {
  const typingHTML = `
    <div class="msg ${side}-msg typing-indicator">
      <div class="msg-img" style="background-image: url(${side === 'left' ? BOT_IMG : PERSON_IMG})">
        <div class="avatar-status ${side === 'left' ? 'bot-status' : 'user-status'}"></div>
      </div>
      <div class="msg-bubble typing-bubble">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  `;
  
  msgerChat.insertAdjacentHTML("beforeend", typingHTML);
  msgerChat.scrollTo({
    top: msgerChat.scrollHeight,
    behavior: 'smooth'
  });
  
  setTimeout(() => {
    const typing = msgerChat.querySelector('.typing-indicator');
    if (typing) typing.remove();
  }, 2000);
}

function botResponse() {
  const r = random(0, BOT_MSGS.length - 1);
  const msgText = BOT_MSGS[r];
  const delay = msgText.split(" ").length * 120 + random(500, 1500);

  showTypingIndicator("left");

  setTimeout(() => {
    const typing = msgerChat.querySelector('.typing-indicator');
    if (typing) typing.remove();
    
    appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    
    setTimeout(() => {
      const botMsg = msgerChat.lastElementChild;
      if (botMsg && botMsg.dataset.name === BOT_NAME) {
        botMsg.classList.add('delivered');
      }
    }, 500);
  }, delay);
}

// Enhanced Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize with location hint
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    appendMessage(BOT_NAME, BOT_IMG, "left", 
      "👋 Welcome to HackerAI! Type **'location'** or **'gps'** to share your coordinates. Ready for cybersecurity help? 🚀");
  }, 1000);
  
  // Auto-request location on page load (optional - comment out if unwanted)
  // setTimeout(() => requestLocation(), 3000);
  
  msgerInput.addEventListener('focus', () => {
    document.querySelector('.msger')?.classList.add('input-focused');
  });
  
  msgerInput.addEventListener('blur', () => {
    document.querySelector('.msger')?.classList.remove('input-focused');
  });
  
  msgerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      msgerForm.dispatchEvent(new Event('submit'));
    }
  });
});

// Same CSS as before (add to your stylesheet)
const style = document.createElement('style');
style.textContent = `
  /* Previous CSS + location-specific styles */
  .msg-text-inner strong {
    color: #00ff88;
    font-weight: 700;
  }
  
  .reaction-btn:first-child:hover {
    background: rgba(0, 255, 136, 0.4);
  }
  
  /* Rest of previous animations... */
  .typing-indicator { opacity: 0.7; }
  .typing-bubble { background: rgba(255,255,255,0.1) !important; min-height: 50px; display: flex; align-items: center; justify-content: flex-start; padding: 15px 20px; }
  .typing-dots { display: flex; gap: 4px; }
  .typing-dots span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.6); animation: typing 1.4s infinite ease-in-out; }
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);
