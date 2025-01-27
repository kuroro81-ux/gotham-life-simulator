console.log("app.js 已成功加载！");

// ===================== 角色状态 =====================
let hunger = 100;        // 饥饿度
let money = 100;         // 资金
let paintings = [];      // 画作数组
let actionPoints = 12;   // 当天剩余行动点
let day = 1;             // 当前天数
let typingTimeout = null; // 防止对话刷新乱码问题

// ===================== 存档功能 =====================
function saveGame() {
    const gameState = {
        hunger,
        money,
        paintings,
        actionPoints,
        day
    };
    localStorage.setItem("gothamLifeSave", JSON.stringify(gameState));
}

// ===================== 读取存档 =====================
function loadGame() {
    const saveData = localStorage.getItem("gothamLifeSave");
    if (saveData) {
        const gameState = JSON.parse(saveData);
        hunger = gameState.hunger;
        money = gameState.money;
        paintings = gameState.paintings;
        actionPoints = gameState.actionPoints;
        day = gameState.day;
    }
}

// ===================== 清除存档 =====================
function resetGame() {
    localStorage.removeItem("gothamLifeSave"); // 先清除存档
    hunger = 100;
    money = 100;
    paintings = [];
    actionPoints = 12;
    day = 1;
    updateStatus();
}

// ===================== 更新UI & 检查游戏结束 =====================
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;

    // 饥饿检查：<=0 游戏结束
    if (hunger <= 0) {
        alert("你因饥饿过度晕倒了，游戏结束。");
        resetGame();
        return;
    }

    // 每次更新完状态都存档
    saveGame();
}

// ===================== 对话相关 =====================

// 确保杰森对话框存在
function checkJasonDialogueBox() {
    return !!document.getElementById("jasonDialogue");
}

// 逐步显示杰森的对话
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

// 每天随机生成一次对话，并存储到 localStorage
function chatWithJason() {
    let savedDialogue = localStorage.getItem("jasonDialogue");
    if (savedDialogue) {
        // 如果当天已经生成过，就直接显示
        showJasonDialogue(savedDialogue);
        return;
    }

    const dialogues = [
        "杰森：哥谭的街头永远不安全。\n他倚靠在墙上，眼神游离了一会儿，像是想到了什么不太愉快的回忆。",
        "杰森：今天遇到了迪克，我们聊了聊。\n他勾起嘴角，像是在回忆什么。'这家伙还是那么多话，不过至少他还愿意听我说点什么。'",
        "杰森：有时候，我在想如果布鲁斯……\n他的话语断在半空中，最终还是没有继续下去。沉默中，你隐约听见他低声叹息。",
        "杰森：你一个人住在这破地方，真的安全吗？\n他皱着眉，看着你住的公寓楼，眼神有些不放心。'如果有事，给我打电话。'他的语气里带着不容置疑的坚定。",
        "杰森：哥谭的警察？你真觉得他们会管你的死活？\n他冷笑了一声，眼神里带着几分不信任。'他们能做的，永远都只是善后。等他们来了，通常已经太迟了。'",
        "杰森：你上次吃饭是什么时候？\n他的语气像是在随口一问，但当你想敷衍过去时，他却皱起眉。'别骗我。你看起来像是几天没好好吃饭了。'",
        "杰森：你最近在画什么？\n他靠近了一点，目光落在你的画架上。'让我看看。'他的语气很随意，但你知道，他是真的感兴趣。",
        "杰森：你知道吗？你和他们不一样。\n他的话让你愣了一下。他没有解释，只是轻轻笑了笑，眼神中闪过一丝不易察觉的情绪。",
        "杰森：你的鞋带松了。\n他的语气淡淡的，但当你低头准备系鞋带时，他已经蹲下，动作利落地帮你绑好。'别让自己摔了。'",
        "杰森：哥谭会吞噬一切。\n他看着远处的街道，灯光在他脸上投下斑驳的阴影。'包括我们。'",
        "杰森：昨晚我发现了一点有趣的东西。\n他靠在桌边，修长的手指轻敲着桌面。'关于黑面具的货物，还有一些……不该出现在哥谭的人。'",
        "杰森：你觉得你能在这座城市活多久？\n他说得很平静，像是在问你今天想吃什么。但你知道他是认真的。",
        "杰森：如果有一天，我突然消失了……\n他的话停在半空中，似乎在等你的反应。然后他笑了笑，'没事，随便问问。'"
    ];

    // 随机选一句
    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    // 存到 localStorage，以便当天再次调用
    localStorage.setItem("jasonDialogue", dialogue);
    showJasonDialogue(dialogue);
}

// ===================== 游戏操作函数 =====================

// 吃饭
function eat() {
    if (money < 10) {
        showJasonDialogue("你没有足够的钱吃饭。");
        return;
    }
    money -= 10;
    hunger += 20;
    showJasonDialogue("你吃了一顿饭，恢复了体力。");
    updateStatus();
}

// 找工作
function work() {
    if (actionPoints < 3) {
        showJasonDialogue("你太累了，无法工作。");
        return;
    }
    actionPoints -= 3;
    hunger -= 10;
    money += 30;
    showJasonDialogue("你努力了一天，赚了一些钱。");
    updateStatus();
}

// 画画
function draw() {
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
}

// 出售画作
function sellPainting() {
    if (paintings.length === 0) {
        showJasonDialogue("你没有画作可以出售。");
        return;
    }
    let painting = paintings.shift();
    money += painting.value;
    showJasonDialogue(`你卖出了一幅画，获得 $${painting.value}`);
    updateStatus();
}

// 结束一天
function endDay() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;
    updateStatus();

    // 触发随机事件，并写入 eventLog
    let eventLog = document.getElementById("eventLog");
    if (eventLog) {
        eventLog.innerText = "今日事件：" + randomEvent();
    }

    // 新的杰森对话（会重置当天对话）
    localStorage.removeItem("jasonDialogue");
    chatWithJason();
}

// ===================== 随机事件 =====================
function randomEvent() {
    const events = [
        "你在街上看到了一只流浪猫，它对你喵喵叫。",
        "一个神秘的黑衣人给了你一张纸条，上面写着“离开哥谭”。",
        "你踩到了一张百元大钞，幸运的是没人看到。",
        "你听到远处传来枪声，但没人注意到。",
        "你在路上撞到了一个熟人，他给了你一点钱。",
        "街角的电视机正在播放有关红头罩的新闻。",
        "你在巷子里看到一个人正在喷涂涂鸦，图案看起来像是红头罩的标志。",
        "你听到远处的警笛声，几秒后，一辆警车疾驰而过。",
        "你目睹了一场小规模的黑帮冲突，但你迅速避开了。",
        "一个衣衫褴褛的人拦住你，低声问：“你相信命运吗？”",
        "有个醉汉在街头大声唱歌，歌词好像是哥谭的一首老歌。",
        "你看到一位老人坐在长椅上喂鸽子，他盯着你看了一会儿，然后微微一笑。",
        "你走过一条小巷，感觉背后有人盯着你，但当你回头时，什么都没有。",
        "路过的小摊贩给了你一块免费的面包，说今天生意很好。",
        "你在地上发现了一张写满奇怪符号的纸条。",
        "你在墙上看到了一个涂鸦，上面写着“哥谭会吞噬你”。",
        "一个陌生人对你微笑了一下，但当你眨眼时，他消失了。",
        "街头的灯突然闪烁几下，然后恢复正常。",
        "你在小巷里看到一个戴着鸟嘴面具的人，他低声说：“时间快到了……”然后消失在黑暗中。",
        "你听到耳边传来低语声，但当你回头时，只有风在吹。",
        "你的口袋里突然多了一张牌，上面画着一个小丑的笑脸。",
        "你路过一家报亭，报纸的头条赫然写着：“你被盯上了。”",
        "一个黑影从高处掠过，你抬头看去，什么都没有。",
        "你无意间发现了一张老彩票，不确定是否还有效。",
        "你的账户里突然多了一笔神秘的款项。",
        "你路过黑市交易的暗巷，听到人们在低声讨论某种“新货”。",
        "你在垃圾桶里看到一本旧书，封面写着《哥谭经济崩溃指南》。",
        "一个穿着昂贵西装的人递给你一张名片，名片上只有一个电话号码。",
        "你注意到某家商店今天的所有物品都在打折，价格低得惊人。",
        "你捡到了一张购物券，但它已经过期。",
        "一个神秘女人递给你一封信，什么也没说就消失了。",
        "你听到两个警察在街角谈论红头罩的最新动向。",
        "一个小孩拉住你的衣角，问：“你见过蝙蝠侠吗？”",
        "你在酒吧外听到有人低声谈论夜翼的行动。",
        "一位老妇人抓住你的手，低声说：“小心夜晚。”然后转身离去。",
        "你的邻居突然搬走了，房间空荡荡的。",
        "有人在墙上留下了一条信息：“别相信任何人。”",
        "你发现自己的门锁被人动过的痕迹。",
        "你回家的时候，发现桌子上多了一张你不认识的照片。",
        "你的背后总有种被人盯着的感觉。",
        "你在小巷里看到一个黑衣人，他似乎在观察你。",
        "有人在你的窗户上用红色喷漆写了几个奇怪的字母。",
        "你发现有人一直跟着你，但当你回头时，对方迅速消失在人群中。",
        "你手机上收到了一条陌生号码发来的短信：‘离开哥谭，否则……’",
        "你发现有人试图闯入你的公寓，但没有成功。",
        "你的邮箱里出现了一封没有署名的信，里面只有一句话：‘你知道得太多了。’",
        "你在公寓门口发现了一朵枯萎的玫瑰。",
        "你在路边的咖啡馆喝咖啡，听到店员讨论最近的超英新闻。",
        "你意外撞到一个抱着一堆书的学生，她不好意思地笑了笑。",
        "一只狗跑过来，对你摇了摇尾巴，然后跑走了。",
        "你看到一个街头艺人在表演魔术，他的手法令人惊叹。",
        "一个小贩请你免费尝试他的最新特制汉堡。",
        "你在街头遇到一个老朋友，他请你喝了一杯。",
        "你在夜市买了一碗热腾腾的面，味道竟然比预想的还要好。"
    ];

    return events[Math.floor(Math.random() * events.length)];
}

// ===================== 将函数挂到 window（供 HTML onclick 调用） =====================
window.eat = eat;
window.work = work;
window.draw = draw;
window.sellPainting = sellPainting;
window.endDay = endDay;
window.resetGame = resetGame;

// ===================== 初始化游戏 =====================
document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    updateStatus();
    chatWithJason();
});
