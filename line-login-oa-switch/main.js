const LINE_LOGIN_CHANNEL_ID = "2008571451";
const CALLBACK_URL =
  "https://rimamura-san.github.io/line-login-oa-switch/";

const loginButton = document.getElementById("login-button");
const forceConsentCheckbox = document.getElementById("force-consent");
const result = document.getElementById("result");

function showResult(message) {
  result.textContent = message;
}

function createState() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));

  return Array.from(
    bytes,
    (byte) => byte.toString(16).padStart(2, "0")
  ).join("");
}

function handleCallback() {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("state");

  // 通常表示時。LINE Loginから戻ったときだけ処理する
  if (!state) return;

  const savedState = sessionStorage.getItem("line_login_state");

  if (state !== savedState) {
    showResult("エラー：ログイン状態の確認に失敗しました。");
    return;
  }

  sessionStorage.removeItem("line_login_state");

  if (params.get("error")) {
    showResult(
      `ログインは完了しませんでした。\n${params.get("error")}\n` +
        (params.get("error_description") ?? "")
    );
    return;
  }

  const friendshipStatusChanged = params.get(
    "friendship_status_changed"
  );

  showResult(
    "LINE Loginの認可が完了しました。\n\n" +
      "friendship_status_changed: " +
      (friendshipStatusChanged ?? "返却なし")
  );

  // code や state をアドレスバーから消す
  window.history.replaceState({}, "", window.location.pathname);
}

function startLogin() {
  if (
    !LINE_LOGIN_CHANNEL_ID ||
    LINE_LOGIN_CHANNEL_ID === "ここにLINE LoginチャネルIDを入れる"
  ) {
    showResult("LINE LoginチャネルIDを main.js に設定してください。");
    return;
  }

  const state = createState();
  sessionStorage.setItem("line_login_state", state);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINE_LOGIN_CHANNEL_ID,
    redirect_uri: CALLBACK_URL,
    state,
    scope: "profile openid",
    bot_prompt: "normal",
  });

  if (forceConsentCheckbox.checked) {
    params.set("prompt", "consent");
  }

  window.location.assign(
    `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`
  );
}

loginButton.addEventListener("click", startLogin);

handleCallback();
