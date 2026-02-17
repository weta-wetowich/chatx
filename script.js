let currentUser = localStorage.getItem("chatx_user");
let currentChat = null;

const users = JSON.parse(localStorage.getItem("chatx_users") || "{}");
const chats = JSON.parse(localStorage.getItem("chatx_chats") || "{}");

function save() {
  localStorage.setItem("chatx_users", JSON.stringify(users));
  localStorage.setItem("chatx_chats", JSON.stringify(chats));
}

function updateUI() {
  if (currentUser) {
    document.getElementById("authButtons").style.display = "none";
    document.getElementById("userPanel").style.display = "flex";
    document.getElementById("currentUser").textContent = currentUser;
  }
}

updateUI();

function openAuth() {
  document.getElementById("authModal").style.display = "flex";
}

function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}

function register() {
  const nick = authNick.value.trim();
  const pass = authPass.value;

  if (!nick || !pass) return alert("Заполните поля");
  if (users[nick]) return alert("Ник занят");

  users[nick] = pass;
  save();
  alert("Регистрация успешна");
}

function login() {
  const nick = authNick.value.trim();
  const pass = authPass.value;

  if (users[nick] !== pass) return alert("Неверные данные");

  currentUser = nick;
  localStorage.setItem("chatx_user", nick);
  closeAuth();
  updateUI();
}

function logout() {
  localStorage.removeItem("chatx_user");
  location.reload();
}

function chatId(a, b) {
  return [a, b].sort().join("|");
}

function openChat() {
  if (!currentUser) return alert("Сначала войдите");

  const target = targetNick.value.trim();
  if (!users[target]) return alert("Пользователь не найден");

  currentChat = chatId(currentUser, target);
  if (!chats[currentChat]) chats[currentChat] = [];
  renderMessages();
}

function sendMessage() {
  if (!currentUser) return alert("Нужно войти");
  if (!currentChat) return alert("Выберите пользователя");

  const text = messageInput.value.trim();
  if (!text) return;

  chats[currentChat].push({
    from: currentUser,
    text: text,
    time: Date.now()
  });

  messageInput.value = "";
  save();
  renderMessages();
}

function renderMessages() {
  messages.innerHTML = "";
  chats[currentChat].forEach(m => {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = `${m.from}: ${m.text}`;
    messages.appendChild(div);
  });
}
