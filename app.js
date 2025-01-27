console.log("app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;
let typingTimeout = null; // 解决对话刷新乱码问题

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
    localStorage.removeItem("gothamLifeSave");
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

    // **修复：当饱食度为 0 时，结束游戏**
    if (hunger <= 0) {
        alert("你因饥饿过度晕倒了，游戏结束。");
        resetGame();
        return;
    }

    saveGame();
}

// **逐步显示杰森的对话**
function showJasonDialogue(dialogue) {
    let dialogueBox = document.getElementById("jasonDialogue");
    dialogueBox.innerHTML = ""; // 清空对话框
    let index = 0;

    // **修复：清除之前的打字计时器，防止乱码**
    if (typingTimeout) clearTimeout(typingTimeout);

    function typeNext() {
        if (index < dialogue.length) {
            dialogueBox.innerHTML += dialogue[index];
            index++;
            typingTimeout = setTimeout(typeNext, 40); // 40ms 显示一个字符
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
        "杰森：哥谭的警察？你真觉得他们会管你的死活？\n他冷笑了一声，眼神里带着几分不信任。'他们能做的，永远都只是善后。等他们来了，通常已经太迟了。'",
        "杰森：你上次吃饭是什么时候？\n他的语气像是在随口一问，但当你想敷衍过去时，他却皱起眉。'别骗我。你看起来像是几天没好好吃饭了。'",
        "杰森：你最近在画什么？\n他靠近了一点，目光落在你的画架上。'让我看看。'他的语气很随意，但你知道，他是真的感兴趣。",
        "杰森：哥谭会吞噬一切。\n他看着远处的街道，灯光在他脸上投下斑驳的阴影。'包括我们。'",
        "杰森：昨晚我发现了一点有趣的东西。\n他靠在桌边，修长的手指轻敲着桌面。'关于黑面具的货物，还有一些……不该出现在哥谭的人。'"
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

// **初始化游戏**
loadGame();
updateStatus();
