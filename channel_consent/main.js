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

    // ここに来たら profile 未同意
    log("profile取得未実行（まだ同意なし）");

  } catch (e) {
    log("LIFF init エラー：" + e);
  }
}


initLiff();
