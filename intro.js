// intro.js

// 当页面加载完毕，如果当前的 day 还没开始(例如 day<1)，先展示开场剧情
window.addEventListener("DOMContentLoaded", () => {
  if (typeof day !== "undefined" && day < 1) {
    showIntroStory();
  }
});

function showIntroStory() {
  // 填充对话框文字
  const eventLog = document.getElementById("eventLog");
  const jasonDialogue = document.getElementById("jasonDialogue");
  
  if (!eventLog || !jasonDialogue) return; // 若没找到对应元素就返回

  eventLog.textContent =
    "【哥谭大学后街】你叫艾琳·凯瑟琳，刚从哥谭大学艺术系毕业就失业。男友杰森看起来也穷得叮当响。";
  jasonDialogue.textContent =
    "杰森：嘿，艾琳。这城市能逼疯人，可咱们总得想办法活下去……";

  // 创建【继续】按钮
  const continueBtn = document.createElement("button");
  continueBtn.textContent = "继续";
  continueBtn.onclick = () => {
    continueBtn.remove();
    showTutorial();
  };
  document.querySelector(".dialogue-box").appendChild(continueBtn);
}

// 显示新手教程
function showTutorial() {
  const eventLog = document.getElementById("eventLog");
  const jasonDialogue = document.getElementById("jasonDialogue");
  eventLog.innerHTML = `
    <strong>欢迎来到《哥谭生活模拟器》！</strong><br>
    在这座危险又荒诞的城市里，你需要想方设法地维持生计……<br><br>
    - <strong>AP</strong>：每一天都有一定行动点数<br>
    - <strong>饱食度</strong>：太低会无法行动<br>
    - <strong>资金</strong>：破产后更艰难<br>
    - <strong>画作</strong>：核心谋生手段<br>
    - <strong>地点</strong>：公寓、街头、黑市，各有不同事件<br>
    - <strong>事件与对话</strong>：别忽视杰森的提示！<br><br>
    祝你好运，先别被饿死。
  `;
  jasonDialogue.textContent =
    "杰森：准备好了吗？";
  
  // 创建【开始游戏】按钮
  const startBtn = document.createElement("button");
  startBtn.textContent = "开始游戏";
  startBtn.onclick = () => {
    startBtn.remove();
    if (typeof day !== "undefined") {
      day = 1; // 把 day 设为 1
    }
    startDay(); // 调用 app.js 的正式开始游戏函数
  };
  document.querySelector(".dialogue-box").appendChild(startBtn);
}
