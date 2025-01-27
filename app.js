console.log("app.js 已成功加载！");

// **角色状态**
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;
let typingTimeout = null; // 防止对话刷新乱码问题

// **存档功能**
function saveGame() {
    let gameState = { hunger, money, paintings, actionPoints, day };
    localStorage.setItem("gothamLifeSave", JSON.stringify(gameState));
}

// **读取存档**
function loadGame() {
    let saveData = localStorage.getItem("gothamLifeSave");
    if (saveData) {
        let gameState = JSON.parse(saveData);
        hunger = gameState.hunger;
        money = gameState.money;
        paintings = gameState.paintings;
        actionPoints = gameState.actionPoints;
        day = gameState.day;
    }
}

// **清除存档**
function resetGame() {
    localStorage.removeItem("gothamLifeSave"); // 先清除存档
    hunger = 100;
    money = 100;
    paintings = [];
    actionPoints = 12;
    day = 1;
    updateStatus();
}

// **更新 UI，并检查是否游戏结束**
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;

    if (hunger <= 0) {
        alert("你因饥饿过度晕倒了，游戏结束。");
        resetGame();
        return;
    }

    saveGame();
}

// **确保杰森对话框存在**
function checkJasonDialogueBox() {
    return !!document.getElementById("jasonDialogue");
}

// **逐步显示杰森的对话**
function showJasonDialogue(dialogue) {
    if (!checkJasonDialogueBox()) {
        console.error("❌ 错误：找不到 #jasonDialogue");
        return;
    }

    let dialogueBox = document.getElementById("jasonDialogue");
    dialogueBox.innerHTML = "";
    let index = 0;

    if (typingTimeout) clearTimeout(typingTimeout);

    function typeNext() {
        if (index < dialogue.length) {
            dialogueBox.innerHTML += dialogue[index];
            index++;
            typingTimeout = setTimeout(typeNext, 40);
        } else {
            typingTimeout = null;
        }
    }

    typeNext();
}

// **杰森的对话**
function chatWithJason() {
    let dialogues = [
        "杰森：哥谭的街头永远不安全。",
        "杰森：今天遇到了迪克，我们聊了聊。",
        "杰森：有时候，我在想如果布鲁斯……",
        "杰森：你一个人住在这破地方，真的安全吗？",
        "杰森：哥谭的警察？你真觉得他们会管你的死活？",
        "杰森：你上次吃饭是什么时候？",
        "杰森：你最近在画什么？",
        "杰森：你知道吗？你和他们不一样。",
        "杰森：你的鞋带松了。",
        "杰森：哥谭会吞噬一切。",
        "杰森：昨晚我发现了一点有趣的东西。",
        "杰森：你觉得你能在这座城市活多久？",
        "杰森：如果有一天，我突然消失了……",
        "杰森：哥谭是个吃人的地方。"
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    showJasonDialogue(dialogue);
}

// **吃饭**
window.eat = function() {
    if (money < 10) {
        showJasonDialogue("你没有足够的钱吃饭。");
        return;
    }
    money -= 10;
    hunger += 20;
    showJasonDialogue("你吃了一顿饭，恢复了体力。");
    updateStatus();
};

// **找工作**
window.work = function() {
    if (actionPoints < 3) {
        showJasonDialogue("你太累了，无法工作。");
        return;
    }
    actionPoints -= 3;
    hunger -= 10;
    money += 30;
    showJasonDialogue("你努力了一天，赚了一些钱。");
    updateStatus();
};

// **画画**
window.draw = function() {
    if (actionPoints < 2) {
        showJasonDialogue("你没有足够的精力作画。");
        return;
    }
    actionPoints -= 2;
    hunger -= 10;
    let quality = Math.floor(Math.random() * 100) + 1;
    let value = quality * 2;
    paintings.push({ quality, value });
    showJasonDialogue(`你完成了一幅画，质量：${quality}，价值：$${value}`);
    updateStatus();
};

// **出售画作**
window.sellPainting = function() {
    if (paintings.length === 0) {
        showJasonDialogue("你没有画作可以出售。");
        return;
    }
    let painting = paintings.shift();
    money += painting.value;
    showJasonDialogue(`你卖出了一幅画，获得 $${painting.value}`);
    updateStatus();
};

// **结束一天，触发随机事件 & 杰森对话**
window.endDay = function() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;
    updateStatus();

    let eventLog = document.getElementById("eventLog");
    if (eventLog) {
        eventLog.innerText = "今日事件：" + randomEvent();
    }

    chatWithJason();
};

// **随机今日事件**
function randomEvent() {
    let events = [
        "你在街上看到了一只流浪猫，它对你喵喵叫。",
        "一个神秘的黑衣人给了你一张纸条，上面写着“离开哥谭”。",
        "你踩到了一张百元大钞，幸运的是没人看到。",
        "你听到远处传来枪声，但没人注意到。",
        "你在巷子里看到一个人正在喷涂涂鸦，图案看起来像是红头罩的标志。",
        "你听到远处的警笛声，几秒后，一辆警车疾驰而过。",
        "你发现自己的门锁被人动过的痕迹。",
        "你回家的时候，发现桌子上多了一张你不认识的照片。",
        "你的背后总有种被人盯着的感觉。",
        "你在路边的咖啡馆喝咖啡，听到店员讨论最近的超英新闻。"
    ];

    return events[Math.floor(Math.random() * events.length)];
}

// **绑定按钮**
window.resetGame = resetGame;

// **初始化游戏**
document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    updateStatus();
    chatWithJason();
});
