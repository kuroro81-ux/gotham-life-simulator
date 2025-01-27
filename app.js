console.log("app.js 已成功加载！");

// ===================== 角色状态 =====================
let hunger = 100;        // 饥饿度
let money = 100;         // 资金
let paintings = [];      // 画作数组
let actionPoints = 12;   // 当天剩余行动点
let day = 1;             // 当前天数
let typingTimeout = null; // 防止对话刷新乱码问题

// ===================== 地图/地点系统 =====================
let currentLocation = "apartment"; // 初始地点：公寓

// 你可以添加更多地点，或调整这里的描述、可执行操作
const locations = {
    apartment: {
        name: "破旧公寓",
        description: "你的廉租公寓，简单但算是个安全的庇护所。",
        actions: ["draw", "eat"] // 仅在公寓可执行的操作
    },
    street: {
        name: "哥谭街头",
        description: "混乱而危险的街头，鱼龙混杂，各种奇遇都有可能发生。",
        actions: ["work", "wander"] // 示例：街头可打工，也可随意闲逛
    },
    blackMarket: {
        name: "黑市",
        description: "不见天日的地下市场，很多见不得光的交易在这里进行。",
        actions: ["sellPainting"]
    }
};

// ===================== 存档功能 =====================
function saveGame() {
    const gameState = {
        hunger,
        money,
        paintings,
        actionPoints,
        day,
        currentLocation
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
        currentLocation = gameState.currentLocation || "apartment";
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
    currentLocation = "apartment";
    updateStatus();
}

// ===================== 切换地点的函数 =====================
function travelToLocation(locKey) {
    // 判断地点是否存在
    if (!locations[locKey]) {
        console.error("未知地点:", locKey);
        return;
    }

    // 简单的移动消耗（消耗1点AP，可自行修改或去掉）
    if (actionPoints < 1) {
        showJasonDialogue("你太累了，走不动了。");
        return;
    }
    actionPoints -= 1;

    currentLocation = locKey;
    updateStatus();

    // 显示当前地点信息
    const locationData = locations[locKey];
    let dialogueBox = document.getElementById("jasonDialogue");
    dialogueBox.innerText = `你来到了【${locationData.name}】。\n${locationData.description}`;

    // 触发地点特有随机事件
    let eventLog = document.getElementById("eventLog");
    if (eventLog) {
        let ev = placeRandomEvent(locKey);
        eventLog.innerText = "事件：" + ev;
    }
}

// 给各地点配置自己的随机事件，也可以不写，就用默认的 randomEvent()
function placeRandomEvent(locKey) {
    const eventsByLocation = {
        apartment: [
            "你发现窗台上落了一只受伤的小鸟。",
            "楼道里灯泡又坏了，昏暗中你差点摔倒。",
            "邻居的电视声音很大，让你休息不太安稳。"
        ],
        street: [
            "有人在路边卖演唱会门票，你犹豫几秒还是没买。",
            "街头一个小混混盯上了你，但似乎没有动手。",
            "一场突如其来的小雨，你狼狈地找地方躲雨。"
        ],
        blackMarket: [
            "你看到有人公然卖违禁药品。",
            "一个戴面具的人低声问：'要不要来点特殊货？'",
            "空气里弥漫着焦躁和危险的气息。"
        ]
        // 如果想添加更多地点，就继续加
    };

    if (!eventsByLocation[locKey]) {
        // 如果没定义，就调用你的通用随机事件
        return randomEvent();
    }
    let arr = eventsByLocation[locKey];
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}

// ===================== 更新UI & 检查游戏结束 =====================
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

    // 每次更新后保存
    saveGame();
}

// ===================== 对话相关 =====================

// 逐步显示杰森的对话
function showJasonDialogue(dialogue) {
    let dialogueBox = document.getElementById("jasonDialogue");
    if (!dialogueBox) {
        console.error("❌ 错误：找不到 #jasonDialogue");
        return;
    }

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

// 随机对话
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

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    localStorage.setItem("jasonDialogue", dialogue);
    showJasonDialogue(dialogue);
}

// ===================== 通用随机事件 =====================
function randomEvent() {
    const events = [
        "你在街上看到了一只流浪猫，它对你喵喵叫。",
        "一个神秘黑衣人给了你一张纸条，上面写着“离开哥谭”。",
        "你踩到了一张百元大钞，幸运的是没人看到。",
        "你听到远处传来枪声，但没人注意到。",
        "你在路上撞到了一个熟人，他给了你一点钱。",
        "街角的电视机正在播放有关红头罩的新闻。",
        "你在巷子里看到一个喷涂涂鸦的人，图案像红头罩的标志。",
        "你听到远处警笛声，几秒后，一辆警车疾驰而过。",
        "你目睹了一场黑帮冲突，但你迅速避开了。",
        "一个衣衫褴褛的人拦住你，低声问：“你相信命运吗？”",
        "有个醉汉在街头大声唱歌，歌词好像是哥谭的一首老歌。",
        "你看到一位老人坐在长椅上喂鸽子，他看了你一会儿，然后微笑。",
        "你走过一条小巷，感觉背后有人盯着你，但回头却空无一人。",
        "路过的小摊贩给了你一块免费的面包，说今天生意很好。",
        "你在地上发现了一张写满奇怪符号的纸条。",
        "你在墙上看到了一个涂鸦，上面写着“哥谭会吞噬你”。",
        "一个陌生人对你笑了一下，但你眨眼后他就消失了。",
        "街头的灯突然闪烁几下，然后恢复正常。",
        "你在小巷里看到一个戴鸟嘴面具的人，他低声说：“时间快到了……”",
        "你听到耳边有低语，但当你回头时，只有风声。",
        "你的口袋里突然多了一张牌，上面画着一个小丑的笑脸。",
        "你路过一家报亭，报纸头条写着：“你被盯上了。”",
        "一个黑影从高处掠过，你抬头什么也没看到。",
        "你无意中发现了一张老彩票，不确定是否过期。",
        "你的账户里突然多了一笔神秘款项。",
        "你路过黑市交易的暗巷，听到有人讨论“新货”。",
        "你在垃圾桶里看到一本旧书，封面写着《哥谭经济崩溃指南》。",
        "一个穿着昂贵西装的人给了你一张名片，上面只有电话。",
        "你注意到某家商店物品全在打折，价格低得惊人。",
        "你捡到了一张购物券，但似乎已过期。",
        "一个神秘女人给你一封信，然后转身消失了。",
        "你听到两个警察在街角谈论红头罩。",
        "一个小孩拉住你问：“你见过蝙蝠侠吗？”",
        "你在酒吧外听到有人低声谈论夜翼的行动。",
        "一位老妇人拉住你，低声说：“小心夜晚。”然后离去。",
        "你的邻居突然搬走了，房间空荡荡。",
        "有人在墙上留下信息：“别相信任何人。”",
        "你发现自己的门锁被人动过。",
        "你回家时，发现桌上多了一张陌生照片。",
        "你总感觉背后有人盯着你。",
        "你在小巷看到一个黑衣人，他似乎在观察你。",
        "有人在你的窗户上用红色喷漆写了奇怪字符。",
        "你发现有人一直跟踪你，但回头时他就消失了。",
        "你手机收到陌生短信：‘离开哥谭，否则……’",
        "似乎有人试图闯入你的公寓，但没成功。",
        "你的邮箱里出现一封无署名信，只有一句：‘你知道得太多了。’",
        "你在公寓门口发现了一朵枯萎的玫瑰。",
        "路边咖啡馆里有人讨论最近的超英新闻。",
        "你撞到一个抱着书的学生，她道歉后匆忙离开。",
        "一只狗跑过来，对你摇摇尾巴，然后跑走了。",
        "你看到街头艺人在表演魔术，手法相当精湛。",
        "一个小贩请你免费尝试他最新的特制汉堡。",
        "你在夜市买了一碗面，味道竟意外地不错。"
    ];
    return events[Math.floor(Math.random() * events.length)];
}

// ===================== 游戏操作函数 =====================

// 吃饭(仅在公寓能执行？可自行决定)
function eat() {
    // 若你希望只能在公寓吃饭，可加判断:
    if (currentLocation !== "apartment") {
        showJasonDialogue("你现在不在公寓，无法做饭或点外卖。");
        return;
    }
    if (money < 10) {
        showJasonDialogue("你没有足够的钱吃饭。");
        return;
    }
    money -= 10;
    hunger += 20;
    showJasonDialogue("你吃了一顿饭，恢复了体力。");
    updateStatus();
}

// 在街头打工
function work() {
    if (currentLocation !== "street") {
        showJasonDialogue("只能在街头找工作/打零工。");
        return;
    }
    if (actionPoints < 3) {
        showJasonDialogue("你太累了，无法工作。");
        return;
    }
    actionPoints -= 3;
    hunger -= 10;
    money += 30;
    showJasonDialogue("你努力工作了一天，赚到一些钱。");
    updateStatus();
}

// 画画(只能在公寓进行)
function draw() {
    if (currentLocation !== "apartment") {
        showJasonDialogue("这里不方便作画，你需要回到公寓。");
        return;
    }
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

// 出售画作(只能在黑市)
function sellPainting() {
    if (currentLocation !== "blackMarket") {
        showJasonDialogue("你只能在黑市出售这些画作。");
        return;
    }
    if (paintings.length === 0) {
        showJasonDialogue("你没有画作可卖。");
        return;
    }
    let painting = paintings.shift();
    money += painting.value;
    showJasonDialogue(`你卖出了一幅画，获得 $${painting.value}`);
    updateStatus();
}

// 示例：街头闲逛 wander
function wander() {
    if (currentLocation !== "street") {
        showJasonDialogue("只有在街头才能随处闲逛。");
        return;
    }
    if (actionPoints < 1) {
        showJasonDialogue("你没有足够的精力继续闲逛。");
        return;
    }
    actionPoints -= 1;
    hunger -= 5;
    let chance = Math.random();
    if (chance < 0.3) {
        money += 10;
        showJasonDialogue("在街头捡到 10 美元，真是走运！");
    } else {
        showJasonDialogue("你随处转悠，但没什么收获。");
    }
    updateStatus();
}

// ===================== 结束一天 =====================
function endDay() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;
    updateStatus();

    // 触发随机事件（通用版本）
    let eventLog = document.getElementById("eventLog");
    if (eventLog) {
        eventLog.innerText = "今日事件：" + randomEvent();
    }

    // 清除当日对话缓存，生成新的
    localStorage.removeItem("jasonDialogue");
    chatWithJason();
}

// ===================== 将函数挂到 window，HTML 中才能 onclick="xxx()" 调用 =====================
window.eat = eat;
window.work = work;
window.draw = draw;
window.sellPainting = sellPainting;
window.wander = wander;
window.endDay = endDay;
window.resetGame = resetGame;
window.travelToLocation = travelToLocation; // 前往某地点

// ===================== 初始化游戏 =====================
document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    updateStatus();
    // 载入后，先让角色出现在当前地点
    travelToLocation(currentLocation);
    // 生成当日对话
    chatWithJason();
});
