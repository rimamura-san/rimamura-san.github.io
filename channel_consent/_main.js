// デバッグ表示
const logEl = document.getElementById("log");
function log(msg) {
  logEl.textContent += "\n" + msg;
}

const greetEl = document.getElementById("greet");
const btnRequest = document.getElementById("btn-request");

// 挨拶
function greet(name) {
  greetEl.textContent = `${name} さん、こんにちは！`;
}

// ボタン消してメッセージ
function hideButtonAfterConsent() {
  btnRequest.style.display = "none";
  const msg = document.createElement("div");
  msg.style.marginTop = "20px";
  msg.style.fontSize = "20px";
  msg.textContent = "アプリをお楽しみください！";
  greetEl.insertAdjacentElement("afterend", msg);
}

// LIFF 初期化
async function initLiff() {
  try {
    await liff.init({ liffId: "2008493036-jGpNZplP" });
    log("LIFF init 完了");

    // UID 表示
    const decoded = liff.getDecodedIDToken();
    if (decoded?.sub) {
      log(`UID: ${decoded.sub}`);
    }

    // 🔥 ここで profile 同意済みかチェック
    const permissions = await liff.permission.query();
    const hasProfile = permissions?.permissions?.profile === "granted";

    if (hasProfile) {
      log("profile同意済み（初回から同意済み）");

      // すでに同意済み → こんにちは表示してボタン非表示
      const profile = await liff.getProfile();
      greet(profile.displayName);
      hideButtonAfterConsent();
      return;
    }

    // ここに来たら profile 未同意
    log("profile取得未実行（まだ同意なし）");

  } catch (e) {
    log("LIFF init エラー：" + e);
  }
}

// requestAll
btnRequest.addEventListener("click", async () => {
  log("追加同意リクエスト開始…");

  try {
    const res = await liff.permission.requestAll({
      withVerificationScreen: true // 通常同意で安定
    });
    log("requestAll 結果：" + JSON.stringify(res));

    // 🔥 permission 結果が "granted" の場合
    if (res.permissions?.profile === "granted") {
      const profile = await liff.getProfile();
      log("profile取得成功！");
      greet(profile.displayName);
      hideButtonAfterConsent();
      return;
    }

  } catch (err) {
    log("requestAll エラー：" + err);

    // 🔥 ここ重要：すでに許可済みのパターン
    if (String(err).includes("already been approved")) {
      log("profileはすでに同意済み（エラーではなく正常）");

      const profile = await liff.getProfile();
      greet(profile.displayName);
      hideButtonAfterConsent();
      return;
    }
  }
});

initLiff();
