if (navigator.vibrate) navigator.vibrate([60, 40, 60]);


// Passe hier nur die Dateinamen an, wenn du willst:
const IMAGES = [
  { src: "images/IMG_5298.jpeg", isMe: true },
  { src: "images/IMG_5668.JPG", isMe: true },
  { src: "images/decoy1.jpg", isMe: false },
  { src: "images/decoy2.jpeg", isMe: false },
  { src: "images/decoy3.jpg", isMe: false },
  { src: "images/decoy4.jpg", isMe: false },
  { src: "images/decoy5.jpg", isMe: false },
  { src: "images/decoy6.jpg", isMe: false },
  { src: "images/decoy7.jpg", isMe: false },
];

const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const verifyBtn = document.getElementById("verifyBtn");
const resetBtn = document.getElementById("resetBtn");

let state = []; // {src,isMe,selected}

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setStatus(msg, type=""){
  statusEl.className = "status" + (type ? ` ${type}` : "");
  statusEl.textContent = msg;
}

function render(){
  grid.innerHTML = "";
  state.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile" + (item.selected ? " selected" : "");
    btn.setAttribute("aria-pressed", item.selected ? "true" : "false");
    btn.setAttribute("aria-label", `Bild ${idx+1}${item.selected ? " ausgewählt" : ""}`);

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = "Captcha Bild";

    const check = document.createElement("div");
    check.className = "tile__check";
    check.textContent = "✓";

    btn.appendChild(img);
    btn.appendChild(check);

    btn.addEventListener("click", () => {
      item.selected = !item.selected;
      setStatus("Wähle die Bilder aus und klicke dann auf „CAPTCHA überprüfen“.");
      render();
    });

    grid.appendChild(btn);
  });
}

function reset(){
  state = shuffle(IMAGES).map(x => ({...x, selected:false}));
  setStatus("Wähle alle Bilder aus, die dein Date zeigen.");
  render();
}

function verify(){
  const selected = state.filter(x => x.selected);
  const selectedMe = selected.filter(x => x.isMe);
  const selectedNotMe = selected.filter(x => !x.isMe);

  // Richtig ist: genau 2 ausgewählt und beide sind "me"
  const ok = (selected.length === 2 && selectedMe.length === 2 && selectedNotMe.length === 0);

  if(ok){
    setStatus("Überprüfung erfolgreich! 💘", "ok");
    // Kurzer Mini-Delay für Gefühl
    setTimeout(() => window.location.href = "success.html", 450);
  } else {
    setStatus("Hmm… das war nicht ganz richtig. Versuch’s nochmal 😊", "error");
    // Auswahl kurz anzeigen lassen, dann neu mischen
    setTimeout(reset, 900);
  }
}

verifyBtn.addEventListener("click", verify);
resetBtn.addEventListener("click", reset);

reset();