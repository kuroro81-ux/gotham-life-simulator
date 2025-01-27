console.log("app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;

// **存档功能**
function saveGame() {
    let gameState = {
        hunger,
        money,
        paintings,
        actionPoints,
        day
    };
    localStorage.setItem("gothamLifeSave", JSON.stringify(gameState));
    console.log("✅ 游戏已存档");
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
        console.log("✅ 游戏存档加载成功");
    } else {
        console.log("⚠️ 未找到存档，使用默认值");
    }
}

// **清除存档**
function resetGame() {
    localStorage.removeItem("gothamLifeSave");
    hunger = 100;
    money = 100;
    paintings = [];
    actionPoints = 12;
    day = 1;
    updateStatus();
    console.log("🔄 游戏已重置");
}

// **更新 UI**
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;
    saveGame();
}

// **逐步显示杰森的对话**
function showJasonDialogue(dialogue) {
    let dialogueBox = document.getElementById("jasonDialogue");
    dialogueBox.innerHTML = ""; // 清空对话框
    let index = 0;

    function typeNext() {
        if (index < dialogue.length) {
            dialogueBox.innerHTML += dialogue[index];
            index++;
            setTimeout(typeNext, 40); // 40ms 显示一个字符
        }
    }

    typeNext();
}

// **杰森的剧情对话**
function chatWithJason() {
    let dialogues = [
        "杰森：哥谭的街头永远不安全。\n他倚靠在墙上，眼神游离了一会儿，像是想到了什么不太愉快的回忆。",
        "杰森：今天遇到了迪克，我们聊了聊。\n他勾起嘴角，像是在回忆什么。'这家伙还是那么多话，不过至少他还愿意听我说点什么。'",
        "杰森：有时候，我在想如果布鲁斯还在……\n他的话语断在半空中，最终还是没有继续下去。沉默中，你隐约听见他低声叹息。",
        "杰森：你一个人住在这破地方，真的安全吗？\n他皱着眉，看着你住的公寓楼，眼神有些不放心。'如果有事，给我打电话。'他的语气里带着不容置疑的坚定。",
        "杰森：哥谭的警察？你真觉得他们会管你的死活？\n他冷笑了一声，眼神里带着几分不信任。'他们能做的，永远都只是善后。等他们来了，通常已经太迟了。'"
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    showJasonDialogue(dialogue);
}

// **吃饭**
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

// **找工作**
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

// **画画**
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

// **出售画作**
window.sellPainting = function() {
    if (paintings.length === 0) {
        document.getElementById("jasonDialogue").innerText = "你没有画作可以出售。";
        return;
    }
    let painting = paintings.shift();
    money += painting.value;
    document.getElementById("jasonDialogue").innerText = `你卖出了一幅画，获得 $${painting.value}`;
    updateStatus();
};

// **结束一天，触发随机事件 & 杰森对话**
window.endDay = function() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;

    updateStatus();

    // **触发随机事件**
    let eventText = randomEvent();
    document.getElementById("eventLog").innerText = `今日事件：${eventText}`;

    // **触发杰森对话**
    chatWithJason();
};

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

// **绑定按钮**
window.resetGame = resetGame;

// **初始化游戏**
loadGame();
updateStatus();
