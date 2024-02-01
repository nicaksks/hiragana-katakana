const doc = {
  home: document.getElementById("home"),
  train: document.getElementById("train"),
  question: document.getElementById("question"),
  alert: document.getElementById("alert-message"),
  submit: document.getElementById("submit"),
  streak: document.getElementById("streak"),
  title: document.getElementById("title"),
  roumaji: document.getElementById("roumaji"),
};

const database = {
  question: {},
  streak: 0
};

const types = ["hiragana", "katakana"];
const query = new URLSearchParams(window.location.search);
const alphabet = query.get("q");

window.onload = async () => {

  if (!alphabet) return;

  types.includes(alphabet.toLocaleLowerCase()) ? await nextQuestion() : window.location.href = '/';
  doc.home.style.display = "none"
  doc.train.style.display = "block";
}

function redirect(query) {
  window.location.href = `?q=${query}`;
}

async function getJson() {
  const response = await fetch(`./assets/json/${alphabet.toLowerCase()}.json`);
  const data = await response.json();
  return data[randomQuestion(data)];
}

function randomQuestion(type) {
  return Math.floor(type.length * Math.random());
}

async function nextQuestion() {
  const data = await getJson();
  hideMessage();

  database.question = data;
  doc.roumaji.placeholder = database.question.kana;
  doc.title.innerHTML = `<br>Que ${alphabet} é esse?<br>`;
  doc.question.innerHTML = questionCSS(data);
}

function questionCSS(data) {
  const { kana, type } = data;
  return `
  <div class="kana">${kana}</div>
  <div class="others" id="others">Roumaji: <span id="spoiler" class="spoiler">    </span> | Tipo: ${type}<br><br></div>
  `;
}

document.addEventListener("click", (event) => {
  const spoiler = event.target.closest("#spoiler");
  if(spoiler) {
    spoiler.innerText = spoiler.innerText.length == 4 ? database.question.roumaji : '    ';
  }
});

function showMessage(color, message) {
  doc.alert.style.color = color;
  doc.alert.innerHTML = message;
}

function hideMessage() {
  doc.alert.innerText = "";
}

function streakMessage() {
  const message = database.streak > 1 ? `Acertos 🔥` : `Acerto`;
  return `<u>${database.streak} ${message}</u>`;
}

doc.submit.addEventListener("click", async (event) => {
  event.preventDefault();

  if (database.question.roumaji === doc.roumaji.value.toLocaleLowerCase()) {
    await nextQuestion()
    database.streak++
  } else {
    database.streak = 0
    showMessage("#E6A4B4", `Resposta incorreta! <br>Resposta certa seria: ${database.question.roumaji.toUpperCase()}<br><br>`);
  }

  doc.roumaji.value = "";
  doc.streak.innerHTML = streakMessage();
})
