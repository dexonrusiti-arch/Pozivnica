// Konfigurisani sadržaj
const config = {
  girlfriendName: "Nina",
  activities: [
    "🍔 Mek Donalds",
    "🚶‍♀️ Šetnja u gradu",
    "🛍️ Šoping u Bigu",
    "🛍️ Šoping u šopiju",
    "🍹 Kokteli"
  ],
  noButtonTexts: [
    "Haha smešno",
    "Stvarno Nina?",
    "Nemaš izbora",
    "Alo bre!"
  ]
};

let selectedDate = null;
let selectedTime = null;
let selectedActivity = null;
let noClickCount = 0;
let activePopup = null;

const app = document.getElementById("app");

// Utility: render screen
function render(html) {
  app.innerHTML = `<div class="screen">${html}</div>`;
}

// Custom popup (bez dugmeta zatvori)
function showPopup(message) {
  if (activePopup) activePopup.remove();

  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20%";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.background = "#fff";
  popup.style.border = "2px solid var(--primary)";
  popup.style.borderRadius = "15px";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  popup.style.zIndex = "9999";
  popup.style.textAlign = "center";
  popup.innerHTML = `
    <p style="color:var(--primary);font-size:1.2em;margin-bottom:0;">${message}</p>
  `;
  document.body.appendChild(popup);

  activePopup = popup;
}

// Ekran 1 — Pitanje
function screenQuestion() {
  render(`
    <h1>Hej ${config.girlfriendName}... 💕</h1>
    <h2>Imam jedno jako važno pitanje...</h2>
    <p>Hoćeš li da izađeš sa mnom na dejt?</p>
    <div style="margin-top:20px;">
      <button id="yesBtn">DA ❤️</button>
      <button id="noBtn" class="secondary">Ne</button>
    </div>
  `);

  document.getElementById("yesBtn").onclick = screenCelebration;
  const noBtn = document.getElementById("noBtn");
  noBtn.onclick = dodgeNo;
}

// NO dugme — nestašno ponašanje
function dodgeNo(e) {
  noClickCount++;
  const btn = e.target;
  btn.textContent = config.noButtonTexts[Math.min(noClickCount - 1, config.noButtonTexts.length - 1)];
  btn.style.position = "absolute";
  btn.style.left = Math.random() * 70 + "%";
  btn.style.top = Math.random() * 70 + "%";
}

// Ekran 2 — Proslava
function screenCelebration() {
  render(`<h1>Znao sam da ćeš reći DA ❤️</h1>`);
  spawnHearts(15);
  setTimeout(screenDate, 2000);
}

// Srca koja lete
function spawnHearts(count) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.textContent = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = "80%";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

// Ekran 3 — Izbor datuma i vremena
function screenDate() {
  render(`
    <h2>Okej... kada idemo? 💕</h2>
    <input type="date" id="datePicker" style="padding:10px;border-radius:10px;border:1px solid var(--secondary);"><br><br>
    <input type="time" id="timePicker" style="padding:10px;border-radius:10px;border:1px solid var(--secondary);" step="60">
    <div style="margin-top:20px;">
      <button id="dateNext">Dalje ➡️</button>
    </div>
  `);

  document.getElementById("dateNext").onclick = () => {
    selectedDate = document.getElementById("datePicker").value;
    selectedTime = document.getElementById("timePicker").value;

    if (!selectedDate || !selectedTime) {
      showPopup("Pa izaberi nešto!");
      return;
    }

    // Easter egg provere
    if (selectedDate < "2026-08-25") {
      showPopup("Pa alo bre ne može unazad!");
      return;
    }
    if (selectedDate === "2026-08-25") {
      showPopup("A da nije kasno malo danas?");
      return;
    }
    if (selectedDate === "2026-08-26") {
      showPopup("Rekoh ti sutra učim za faksssss!");
      return;
    }

    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }

    screenActivity();
  };
}

// Ekran 4 — Aktivnost
function screenActivity() {
  let options = config.activities.map(a => `<button class="activity">${a}</button>`).join(" ");
  render(`
    <h2>I šta ćemo da radimo? 💗</h2>
    <div>${options}</div>
  `);

  document.querySelectorAll(".activity").forEach(btn => {
    btn.onclick = () => {
      selectedActivity = btn.textContent;
      if (!selectedActivity) {
        showPopup("Pa izaberi nešto!");
        return;
      }
      screenFinal();
    };
  });
}

// Ekran 5 — Konačno otkrivanje
function screenFinal() {
  if (!selectedActivity) {
    showPopup("Pa izaberi nešto!");
    return;
  }

  let timeFormatted = selectedTime ? selectedTime + "h" : "";

  render(`
    <h1>Dogovoreno! 💕</h1>
    <p>📅 ${selectedDate}</p>
    <p>⏰ ${timeFormatted}</p>
    <p>💗 ${selectedActivity}</p>
    <p>Jedva čekam! 🥰</p>
    <div style="margin-top:20px;">
      <button id="resetBtn">🔄 Resetuj pozivnicu</button>
    </div>
    <div id="letter" class="letter">✉️</div>
    <div id="letterContent" class="letter-content hidden">
      <p>Nina, srećnih nam 4 godine i 3 meseca,<br>Voli te tvoj Dexony ❤️</p>
    </div>
  `);
  spawnHearts(25);

  document.getElementById("resetBtn").onclick = () => {
    selectedDate = null;
    selectedTime = null;
    selectedActivity = null;
    noClickCount = 0;
    if (activePopup) {
      activePopup.remove();
      activePopup = null;
    }
    screenQuestion();
  };

  const letter = document.getElementById("letter");
  const letterContent = document.getElementById("letterContent");

  // pozicioniranje pisma
  letter.style.position = "fixed";
  letter.style.right = "-100px";
  letter.style.bottom = "150px";
  letter.style.fontSize = "2.5em";
  letter.style.cursor = "pointer";
  letter.style.transition = "right 0.8s ease";

  setTimeout(() => {
    letter.classList.add("show-letter");
    letter.style.animation = "shake 1s infinite";
  }, 1000);

  letter.onclick = () => {
    letterContent.classList.remove("hidden");
    letter.classList.add("hidden");
  };
}

// Start
screenQuestion();
