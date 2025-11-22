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

// LIFF 初期化（最初は openid のみで起動）
async function initLiff() {
  try {
    await liff.init({
      liffId: "2008493036-jGpNZplP" // ←あなたのIDに変更
    });

    log("LIFF init 完了");

    // openid の UID を表示（簡略化同意ONでも最初から取れる）
    const decoded = liff.getDecodedIDToken();
    if (decoded?.sub) {
      log(`UID: ${decoded.sub}`);
    }

    // 初回は profile を取りに行かない（モーダル自動発火を防ぐ）
    log("profile取得未実行（まだ同意なし）");

  } catch (e) {
    log("LIFF init エラー：" + e);
  }
}

// ボタン押下で requestAll → profile取得
btnRequest.addEventListener("click", async () => {
  log("追加同意リクエスト開始…");

  try {
    const res = await liff.permission.requestAll();
    log("requestAll 結果：" + JSON.stringify(res));

    if (res.permissions?.profile === "granted") {

      // 初めてここで profile を取りに行く
      const profile = await liff.getProfile();
      log("profile取得成功！");
      greet(profile.displayName);
      hideButtonAfterConsent();

    } else {
      log("profile 同意なし or 拒否");
    }

  } catch (err) {
    log("requestAll エラー：" + err);
  }
});

initLiff();
