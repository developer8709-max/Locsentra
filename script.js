let userLocation = null;

document.addEventListener("DOMContentLoaded", () => {
  updateTime();
  getLocation();
  document.getElementById("messageForm").addEventListener("submit", sendMessage);
});

function updateTime() {
  document.getElementById("currentTime").textContent =
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(pos => {
    userLocation = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy
    };
    showStatus("GPS Active");
  });
}

function showStatus(text) {
  const status = document.getElementById("locationStatus");
  status.textContent = text;
  status.style.display = "block";
  setTimeout(() => status.style.display = "none", 3000);
}

function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "You", "right");
  input.value = "";

  setTimeout(() => {
    addMessage(getAIResponse(msg), "LocationGPT", "left");
  }, 1200);
}

function addMessage(text, sender, side) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = `msg ${side}-msg`;
  div.innerHTML = `
    <div class="msg-bubble">
      <strong>${sender}</strong><br>${text}
    </div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getAIResponse(msg) {
  if (userLocation) {
    return `📍 Found people near you within ${Math.round(userLocation.accuracy)} meters.`;
  }
  return "📍 Please enable location access.";
}
