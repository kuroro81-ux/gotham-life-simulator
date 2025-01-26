console.log("app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;

// **加载存档**
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

function saveGame() {
    let gameState = {
        hunger,
        money,
        paintings,
        actionPoints,
        day
    };
    localStorage.setItem("gothamLifeSave", JSON.stringify(gameState));
}

function resetGame() {
    localStorage.removeItem("gothamLifeSave");
    hunger = 100;
    money = 100;
    paintings = [];
    actionPoints = 12;
    day = 1;
    updateStatus();
}

// **更新 UI**
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;

    if (hunger <= 0) {
        alert("你因饥饿过度晕倒了，游戏结束。");
        resetGame();
    }

    saveGame();
}

// **结束一天**
function endDay() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;

    updateStatus();

    // **触发随机事件**
    let eventText = randomEvent();
    document.getElementById("eventLog").innerText = `今日事件：${eventText}`;

    // **触发杰森对话**
    let jasonText = chatWithJason();
    document.getElementById("jasonDialogue").innerText = jasonText;
}

// **随机事件**
function randomEvent() {
    let events = [
        "你在街上看到了一只流浪猫，它对你喵喵叫。",
        "一个神秘的黑衣人给了你一张纸条，上面写着“离开哥谭”。",
        "你踩到了一张百元大钞，幸运的是没人看到。",
        "你听到远处传来枪声，但没人注意到。",
        "你在路上撞到了一个熟人，他给了你一点钱。",
        "街角的电视机正在播放有关红头罩的新闻。"
    ];
    return events[Math.floor(Math.random() * events.length)];
}

// **杰森的随机对话**
function chatWithJason() {
    let dialogues = [
        "杰森：哥谭的街头永远不安全。",
        "杰森：今天遇到了迪克，我们聊了聊。",
        "杰森：如果有一天，你会选择离开哥谭吗？",
        "杰森：你应该更注意自己的安全。",
        "杰森：哥谭是个没有英雄的地方。",
        "杰森：我最近有些麻烦，但不想让你担心。",
        "杰森：红头罩这个名字，你怎么看？",
        "杰森：有时候，我在想如果布鲁斯还在……"
    ];
    return dialogues[Math.floor(Math.random() * dialogues.length)];
}

// **出售画作**
function sellPainting() {
    if (paintings.length === 0) {
        document.getElementById("jasonDialogue").innerText = "你没有画作可以出售。";
        return;
    }
    let painting = paintings.shift();
    money += painting.value;
    document.getElementById("jasonDialogue").innerText = `你卖出了一幅画，获得 $${painting.value}`;
    updateStatus();
}

// **绑定按钮**
window.eat = function() {
    if (money < 10) {
        document.getElementById("jasonDialogue").innerText = "你没有足够的钱吃饭。";
        return;
    }
    money -= 10;
    hunger += 20;
    document.getElementById("jasonDialogue").innerText = "你吃了一顿饭，恢复了体力。";
    updateStatus();
};

window.work = function() {
    if (actionPoints < 3) {
        document.getElementById("jasonDialogue").innerText = "你太累了，无法工作。";
        return;
    }
    actionPoints -= 3;
    hunger -= 10;
    money += 30;
    document.getElementById("jasonDialogue").innerText = "你努力了一天，赚了一些钱。";
    updateStatus();
};

window.draw = function() {
    if (actionPoints < 2) {
        document.getElementById("jasonDialogue").innerText = "你没有足够的精力作画。";
        return;
    }
    actionPoints -= 2;
    hunger -= 10;
    let quality = Math.floor(Math.random() * 100) + 1;
    let value = quality * 2;
    paintings.push({ quality: quality, value: value });
    document.getElementById("jasonDialogue").innerText = `你完成了一幅画，质量：${quality}，价值：$${value}`;
    updateStatus();
};

window.sellPainting = sellPainting;
window.endDay = endDay;
window.resetGame = resetGame;

// **初始化状态**
loadGame();
updateStatus();
