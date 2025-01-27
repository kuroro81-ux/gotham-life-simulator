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

// **确保杰森对话框存在**
function checkJasonDialogueBox() {
    if (!document.getElementById("jasonDialogue")) {
        console.error("❌ 错误：找不到 #jasonDialogue");
        return false;
    }
    return true;
}

// **逐步显示杰森的对话**
function showJasonDialogue(dialogue) {
    if (!checkJasonDialogueBox()) return; // 确保对话框存在

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
    if (!document.getElementById("jasonDialogue")) {
        console.error("❌ 错误：找不到 #jasonDialogue");
        return;
    }

    let dialogues = [
        // 🔴 经典对话
        "杰森：哥谭的街头永远不安全。\n他倚靠在墙上，眼神游离了一会儿，像是想到了什么不太愉快的回忆。",
        "杰森：今天遇到了迪克，我们聊了聊。\n他勾起嘴角，像是在回忆什么。'这家伙还是那么多话，不过至少他还愿意听我说点什么。'",
        "杰森：有时候，我在想如果布鲁斯……\n他的话语断在半空中，最终还是没有继续下去。沉默中，你隐约听见他低声叹息。",
        "杰森：你一个人住在这破地方，真的安全吗？\n他皱着眉，看着你住的公寓楼，眼神有些不放心。'如果有事，给我打电话。'他的语气里带着不容置疑的坚定。",
        "杰森：哥谭的警察？你真觉得他们会管你的死活？\n他冷笑了一声，眼神里带着几分不信任。'他们能做的，永远都只是善后。等他们来了，通常已经太迟了。'",

        // 🔴 关心 & 互动
        "杰森：你上次吃饭是什么时候？\n他的语气像是在随口一问，但当你想敷衍过去时，他却皱起眉。'别骗我。你看起来像是几天没好好吃饭了。'",
        "杰森：你最近在画什么？\n他靠近了一点，目光落在你的画架上。'让我看看。'他的语气很随意，但你知道，他是真的感兴趣。",
        "杰森：你知道吗？你和他们不一样。\n他的话让你愣了一下。他没有解释，只是轻轻笑了笑，眼神中闪过一丝不易察觉的情绪。",
        "杰森：你的鞋带松了。\n他的语气淡淡的，但当你低头准备系鞋带时，他已经蹲下，动作利落地帮你绑好。'别让自己摔了。'",

        // 🔴 杰森的回忆
        "杰森：小时候，我经常在雨里跑。\n他随意地提起，好像这只是个小事。'我喜欢雨。它能盖住一切声音，也能洗掉血迹。'",
        "杰森：我以前很喜欢收集打火机。\n他点燃一根火柴，凝视着微弱的火光。'可能是因为火总能带来某种终结吧。'",
        "杰森：你知道吗？我小时候会偷汽车。\n他的语气平静得可怕，仿佛这只是一个普通的童年回忆。'我很擅长这个，直到布鲁斯找到我。'",
        "杰森：有时候，我也会梦到过去。\n他的语气有些低落。'但梦里，总是有枪声。'他顿了顿，轻轻笑了笑，'我想我已经习惯了。'",

        // 🔴 哥谭的阴影 & 伏笔
        "杰森：哥谭会吞噬一切。\n他看着远处的街道，灯光在他脸上投下斑驳的阴影。'包括我们。'",
        "杰森：昨晚我发现了一点有趣的东西。\n他靠在桌边，修长的手指轻敲着桌面。'关于黑面具的货物，还有一些……不该出现在哥谭的人。'",
        "杰森：你觉得你能在这座城市活多久？\n他说得很平静，像是在问你今天想吃什么。但你知道他是认真的。",
        "杰森：有时候，我会想，我是不是该彻底离开这里。\n他靠在窗边，凝视着远处的霓虹灯，嘴角的笑意带着几分苦涩。'但事实是，我离不开。就像你一样。'",

        // 🔴 偶尔的幽默感
        "杰森：你今天看起来……嗯，有点像个正常人。\n他意味不明地笑了一下，'别误会，我是说，比平时更像了。'",
        "杰森：你知道哥谭最不靠谱的天气预报是什么吗？\n他一本正经地说：'说今晚会是个平静的夜晚。'",
        "杰森：你觉得我很暴躁吗？\n他盯着你，等你的回答。'嗯……行吧，可能有点。'他轻轻哼了一声。'但这不代表我会改。'",
        "杰森：我昨天买了一个汉堡，但忘了吃。\n他看起来很严肃，你以为他要说什么重要的事情，结果他只是叹了口气，'这对我来说可是个悲剧。'",
        
        // 🔴 更深层次的情绪
        "杰森：你相信人可以改变吗？\n他的声音很轻，但你能听出里面的矛盾。'还是说，骨子里的东西，永远不会变？'",
        "杰森：如果有一天，我突然消失了……\n他的话停在半空中，似乎在等你的反应。然后他笑了笑，'没事，随便问问。'",
        "杰森：哥谭是个吃人的地方。\n他点燃一根烟，眼神有些飘忽不定。'但我想，我们都知道这一点了。'",
        "杰森：有时候，我会想，如果那天我没有回来，会怎么样？\n他垂下眼睑，沉默了片刻。'但想这种事情没什么意义，对吧？'"
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    showJasonDialogue(dialogue);
}

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
    paintings.push({ quality: quality, value: value });
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
window.onload = function() {
    loadGame();
    updateStatus();
    chatWithJason(); // 确保游戏启动时就有一条对话
};
