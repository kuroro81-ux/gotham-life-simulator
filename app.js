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
        // 🔴 经典对话
        "杰森：哥谭的街头永远不安全。\n他倚靠在墙上，眼神游离了一会儿，像是想到了什么不太愉快的回忆。",
        "杰森：今天遇到了迪克，我们聊了聊。\n他勾起嘴角，像是在回忆什么。'这家伙还是那么多话，不过至少他还愿意听我说点什么。'",
        "杰森：有时候，我在想如果布鲁斯……\n他的话语断在半空中，最终还是没有继续下去。沉默中，你隐约听见他低声叹息。",
        "杰森：你一个人住在这破地方，真的安全吗？\n他皱着眉，看着你住的公寓楼，眼神有些不放心。'如果有事，给我打电话。'他的语气里带着不容置疑的坚定。",
        "杰森：哥谭的警察？你真觉得他们会管你的死活？\n他冷笑了一声，眼神里带着几分不信任。'他们能做的，永远都只是善后。等他们来了，通常已经太迟了。'",

        // 🔴 个人经历 & 回忆
        "杰森：小时候，我经常在雨里跑。\n他随意地提起，好像这只是个小事。'我喜欢雨。它能盖住一切声音，也能洗掉血迹。'",
        "杰森：你信任我吗？\n问题来得很突然，你甚至没来得及思考。他静静地看着你，嘴角带着一丝若有若无的笑容，但眼神里却没有笑意。",
        "杰森：我有一段时间很喜欢收集打火机。\n他点燃一根火柴，凝视着微弱的火光。'可能是因为火总能带来某种终结吧。'",
        "杰森：有时候，我也会梦到老地方。\n他的语气有些低落。'但梦里，总是有枪声。'他顿了顿，轻轻笑了笑，'我想我已经习惯了。'",

        // 🔴 关心 & 互动
        "杰森：你上次吃饭是什么时候？\n他的语气像是在随口一问，但当你想敷衍过去时，他却皱起眉。'别骗我。你看起来像是几天没好好吃饭了。'",
        "杰森：你最近在画什么？\n他靠近了一点，目光落在你的画架上。'让我看看。'他的语气很随意，但你知道，他是真的感兴趣。",
        "杰森：你知道吗？你和他们不一样。\n他的话让你愣了一下。他没有解释，只是轻轻笑了笑，眼神中闪过一丝不易察觉的情绪。",
        "杰森：有时候，我觉得你太天真了。\n他的声音低沉，像是藏着什么没说出口的话。'但……也许，这并不是什么坏事。'",
        "杰森：你的鞋带松了。\n他的语气淡淡的，但当你低头准备系鞋带时，他已经蹲下，动作利落地帮你绑好。'别让自己摔了。'",

        // 🔴 更私人的瞬间
        "杰森：你知道什么味道让我最安心吗？\n他想了一下，回答道：'干净的被子，刚洗过的衣服，还有……'他顿了顿，'你身上的味道。'",
        "杰森：如果你能带一样东西离开哥谭，你会带什么？\n他靠在窗边，等着你的答案。而你发现，他自己好像没有答案。",
        "杰森：你知道吗，我有一段时间想当医生。\n他似乎在认真思考这个问题。'但后来我发现，我更擅长……打破规则。'",

        // 🔴 哥谭的阴影 & 伏笔
        "杰森：哥谭会吞噬一切。\n他看着远处的街道，灯光在他脸上投下斑驳的阴影。'包括我们。'",
        "杰森：昨晚我发现了一点有趣的东西。\n他靠在桌边，修长的手指轻敲着桌面。'关于黑面具的货物，还有一些……不该出现在哥谭的人。'",
        "杰森：你觉得你能在这座城市活多久？\n他说得很平静，像是在问你今天想吃什么。但你知道他是认真的。",
        "杰森：有时候，我会想，我是不是该彻底离开这里。\n他靠在窗边，凝视着远处的霓虹灯，嘴角的笑意带着几分苦涩。'但事实是，我离不开。就像你一样。'",

        // 🔴 偶尔的幽默感
        "杰森：你今天看起来……嗯，有点像个正常人。\n他意味不明地笑了一下，'别误会，我是说，比平时更像了。'",
        "杰森：你知道哥谭最不靠谱的天气预报是什么吗？\n他一本正经地说：'说今晚会是个平静的夜晚。'",
        "杰森：有人说我脾气不好。\n他耸耸肩，嘴角带着一点戏谑的笑容。'我只是……不喜欢浪费时间而已。'",
        "杰森：你觉得我很暴躁吗？\n他盯着你，等你的回答。'嗯……行吧，可能有点。'他轻轻哼了一声。'但这不代表我会改。'"
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
