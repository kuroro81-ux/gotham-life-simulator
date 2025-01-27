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

  // —— 开场剧情文本，稍作润色 ——
  eventLog.textContent =
    "【哥谭大学后街】\n" +
    "你叫艾琳·凯瑟琳（Erin Katherine），刚从哥谭大学艺术系毕业就“喜提”失业。" +
    "阴暗的哥谭并没有给你留多少喘息的空间。你那（看起来）贫困潦倒、吊儿郎当的男友——杰森·陶德，也似乎无法提供任何经济支持。";
  
  jasonDialogue.textContent =
    "杰森：嘿，艾琳。这城市会把人逼到绝境，但我们还得想办法活下去……";

  // —— 创建“继续”按钮，点击后进入新手教程 ——
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

  // —— 新手介绍，主要讲解游戏要素 ——
  eventLog.innerHTML = `
    <strong>欢迎来到《哥谭生活模拟器》！</strong><br><br>
    在这座危险又荒诞的城市里，你需要用你的画笔和机智，才能不被它一点点吞噬。<br>
    <ul style="text-align:left; padding-left:20px;">
      <li><strong>AP（行动点）</strong>：每天有限的精力，消耗完就只能结束一天。</li>
      <li><strong>饱食度</strong>：饥饿会影响你的行动，如果过低，你可能会倒下。</li>
      <li><strong>资金</strong>：贫穷会让一切变得更艰难，学会赚钱与节约。</li>
      <li><strong>画作</strong>：这是你的特长，完成后可以找机会卖出，换取生存的资本。</li>
      <li><strong>地点</strong>：公寓、街头、黑市……每个地方都可能藏着机遇或危险。</li>
      <li><strong>事件与对话</strong>：哥谭从不缺诡异的人和事，杰森有时会给你提示，也可能带来更多烦恼。</li>
    </ul>
    祝你在哥谭——至少先别被饿死。
  `;

  jasonDialogue.textContent =
    "杰森：准备好了吗？不管怎样，我们要先熬过明天……";
  
  // —— 创建“开始游戏”按钮，点击后进入第1天 ——
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
