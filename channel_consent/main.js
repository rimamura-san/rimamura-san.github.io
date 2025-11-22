// デバッグ表示
const logEl = document.getElementById("log");
function log(msg) {
  logEl.textContent += "\n" + msg;
}

// 挨拶エリア
const greetEl = document.getElementById("greet");

// ボタン
const btnRequest = document.getElementById("btn-request");

// 挨拶を表示
function greet(name) {
  greetEl.textContent = `${name} さん、こんにちは！`;
}

// ボタンを非表示にしてメッセージ表示
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
    await liff.init({
      liffId: "2008493036-jGpNZplP"    // ← あなたの LIFF Lite ID に変更
    });

    log("LIFF init 完了");

    // openid（ID Token）から UID を表示
    const decoded = liff.getDecodedIDToken();
    if (decoded && decoded.sub) {
      log(`UID: ${decoded.sub}`);
    } else {
      log("UID 未取得");
    }

    // profile取得（初回は consent 無いので失敗）
    try {
      const profile = await liff.getProfile();
      log("profile取得成功（すでに同意済み？）");
      greet(profile.displayName);  // 挨拶表示
    } catch {
      log("profile取得失敗（まだ profile 同意なし）");
    }

  } catch (e) {
    log("LIFF init エラー：" + e);
  }
}

// requestAll（追加同意）
btnRequest.addEventListener("click", async () => {
  log("追加同意リクエスト開始…");

  try {
    const res = await liff.permission.requestAll();
    log("requestAll 結果：" + JSON.stringify(res));

    if (res.permissions?.profile === "granted") {
      const profile = await liff.getProfile();
      log("profile取得成功！");
      greet(profile.displayName);
      hideButtonAfterConsent();   // ← ボタンを隠してメッセージ表示
    } else {
      log("profile 同意なし or 拒否");
    }

  } catch (err) {
    log("requestAll エラー：" + err);
  }
});

initLiff();


