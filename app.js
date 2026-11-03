// Night Sky Study Planner — all data lives in your browser's localStorage.
const STORAGE_KEY = "studyPlanner.v1";

const $ = (id) => document.getElementById(id);
const datePicker = $("datePicker");
const goalForm = $("goalForm");
const goalInput = $("goalInput");
const minutesInput = $("minutesInput");
const goalList = $("goalList");
const emptyMsg = $("emptyMsg");
const notes = $("notes");

// data shape: { "2026-11-03": { goals: [{ id, text, minutes, done }], notes: "" } }
let data = load();
let currentDate = toKey(new Date());

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shiftDate(key, days) {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

function getDay(key) {
  if (!data[key]) data[key] = { goals: [], notes: "" };
  return data[key];
}

function dayStatus(key) {
  const day = data[key];
  if (!day || day.goals.length === 0) return "";
  const done = day.goals.filter((g) => g.done).length;
  if (done === day.goals.length) return "full";
  return done > 0 ? "partial" : "";
}

function render() {
  datePicker.value = currentDate;
  const day = data[currentDate] || { goals: [], notes: "" };

  goalList.innerHTML = "";
  day.goals.forEach((goal) => {
    const li = document.createElement("li");
    if (goal.done) li.classList.add("done");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = goal.done;
    cb.addEventListener("change", () => {
      goal.done = cb.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.className = "goal-text";
    text.textContent = goal.text;

    li.append(cb, text);

    if (goal.minutes) {
      const mins = document.createElement("span");
      mins.className = "mins";
      mins.textContent = `${goal.minutes} min`;
      li.append(mins);
    }

    const del = document.createElement("button");
    del.className = "delete";
    del.textContent = "×";
    del.title = "Remove goal";
    del.addEventListener("click", () => {
      day.goals = day.goals.filter((g) => g.id !== goal.id);
      save();
      render();
    });
    li.append(del);

    goalList.append(li);
  });

  emptyMsg.hidden = day.goals.length > 0;

  const done = day.goals.filter((g) => g.done).length;
  const total = day.goals.length;
  $("progressFill").style.width = total ? `${(done / total) * 100}%` : "0";
  const doneMins = day.goals.filter((g) => g.done).reduce((s, g) => s + (g.minutes || 0), 0);
  const totalMins = day.goals.reduce((s, g) => s + (g.minutes || 0), 0);
  $("progressText").textContent =
    `${done} / ${total} done` + (totalMins ? ` · ${doneMins}/${totalMins} min` : "");

  if (document.activeElement !== notes) notes.value = day.notes || "";

  renderHistory();
}

function renderHistory() {
  const history = $("history");
  history.innerHTML = "";
  const today = toKey(new Date());
  for (let i = 6; i >= 0; i--) {
    const key = shiftDate(today, -i);
    const d = fromKey(key);
    const cell = document.createElement("div");
    cell.className = `day ${dayStatus(key)}`;
    if (key === currentDate) cell.classList.add("selected");
    cell.innerHTML = `<div>${d.toLocaleDateString(undefined, { weekday: "short" })}</div><div class="dot"></div><div>${d.getDate()}</div>`;
    cell.title = key;
    cell.addEventListener("click", () => { currentDate = key; render(); });
    history.append(cell);
  }

  // streak: consecutive fully-completed days ending today (or yesterday if today isn't done yet)
  let streak = 0;
  let key = dayStatus(today) === "full" ? today : shiftDate(today, -1);
  while (dayStatus(key) === "full") {
    streak++;
    key = shiftDate(key, -1);
  }
  $("streak").textContent = streak;
}

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;
  getDay(currentDate).goals.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text,
    minutes: parseInt(minutesInput.value, 10) || 0,
    done: false,
  });
  save();
  goalInput.value = "";
  minutesInput.value = "";
  goalInput.focus();
  render();
});

notes.addEventListener("input", () => {
  getDay(currentDate).notes = notes.value;
  save();
});

datePicker.addEventListener("change", () => {
  if (datePicker.value) { currentDate = datePicker.value; render(); }
});
$("prevDay").addEventListener("click", () => { currentDate = shiftDate(currentDate, -1); render(); });
$("nextDay").addEventListener("click", () => { currentDate = shiftDate(currentDate, 1); render(); });
$("todayBtn").addEventListener("click", () => { currentDate = toKey(new Date()); render(); });

// ---- twinkling star background ----
const canvas = $("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function makeStars() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const count = Math.floor((canvas.width * canvas.height) / 5000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
    blue: Math.random() < 0.4,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.phase += s.speed;
    const alpha = 0.4 + Math.sin(s.phase) * 0.4;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.blue ? `rgba(150,190,255,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", makeStars);
makeStars();
drawStars();
render();
