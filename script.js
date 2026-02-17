let currentUser = localStorage.getItem("chatx_user");
let currentChat = null;
let channel = null;

function openAuth() {
  authModal.style.display = "flex";
}
function closeAuth() {
  authModal.style.display = "none";
}

async function register() {
  const nickname = nick.value.trim();
  const password = pass.value;
  if (!nickname || !password) return alert("Заполните поля");

  const { error } = await supabase.from("users").insert({ nickname, password });
  if (error) return alert("Ник занят");

  alert("Регистрация успешна");
}

async function login() {
  const nickname = nick.value.trim();
  const password = pass.value;

  const { data } = await supabase
    .from("users")
    .select()
    .eq("nickname", nickname)
    .eq("password", password)
    .single();

  if (!data) return alert("Неверные данные");

  currentUser = nickname;
  localStorage.setItem("chatx_user", nickname);
  closeAuth();
  authArea.innerHTML = `<span>${nickname}</span> <button onclick="logout()">Выйти</button>`;
}

function logout() {
  localStorage.removeItem("chatx_user");
  location.reload();
}

if (currentUser) {
  authArea.innerHTML = `<span>${currentUser}</span> <button onclick="logout()">Выйти</button>`;
}

function chatId(a, b) {
  return [a, b].sort().join("|");
}

async function openChat() {
  if (!currentUser) return alert("Войдите в аккаунт");
  const target = targetNick.value.trim();
  if (!target) return;

  currentChat = chatId(currentUser, target);
  messages.innerHTML = "";

  const { data } = await supabase
    .from("messages")
    .select()
    .or(`and(from_nick.eq.${currentUser},to_nick.eq.${target}),and(from_nick.eq.${target},to_nick.eq.${currentUser})`)
    .order("created_at");

  data.forEach(renderMessage);

  if (channel) supabase.removeChannel(channel);

  channel = supabase
    .channel("chatx")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      payload => {
        const m = payload.new;
        if (chatId(m.from_nick, m.to_nick) === currentChat) {
          renderMessage(m);
        }
      }
    )
    .subscribe();
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || !currentChat) return;

  const [a, b] = currentChat.split("|");
  const to = a === currentUser ? b : a;

  await supabase.from("messages").insert({
    from_nick: currentUser,
    to_nick: to,
    text
  });

  messageInput.value = "";
}

function renderMessage(m) {
  const div = document.createElement("div");
  div.className = "msg";
  if (m.from_nick === currentUser) div.classList.add("me");
  div.textContent = `${m.from_nick}: ${m.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
