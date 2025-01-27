console.log("app.js 已成功加载！");

// ============ 角色基础状态 ============
let hunger = 100;         // 饥饿度
let money = 100;          // 资金
let paintings = [];       // 画作数组
let actionPoints = 12;    // 当天可用行动点
let day = 0;              // 当前天数
let typingTimeout = null; // 打字机定时器
let jasonAffection = 0;   // 杰森好感度

// 若玩家购买了“高级画材”，则下次画画时获得价值加成
let hasAdvancedPaintKit = false; 

// ============ 地图 / 地点系统 ============
let currentLocation = "apartment"; // 初始地点

const locations = {
  apartment: {
    name: "破旧公寓",
    description: "你的廉租公寓，简单但算是个安全的庇护所。",
  },
  street: {
    name: "哥谭街头",
    description: "混乱而危险的街头，鱼龙混杂，各种奇遇都有可能发生。",
  },
  blackMarket: {
    name: "黑市",
    description: "不见天日的地下市场，很多见不得光的交易在这里进行。",
  }
};

// ============ 存档功能 ============
function saveGame() {
  const gameState = {
    hunger,
    money,
    paintings,
    actionPoints,
    day,
    currentLocation,
    jasonAffection,
    hasAdvancedPaintKit
  };
  localStorage.setItem("gothamLifeSave", JSON.stringify(gameState));
}

function loadGame() {
  const data = localStorage.getItem("gothamLifeSave");
  if (data) {
    const gs = JSON.parse(data);
    hunger = gs.hunger;
    money = gs.money;
    paintings = gs.paintings;
    actionPoints = gs.actionPoints;
    day = gs.day;
    currentLocation = gs.currentLocation || "apartment";
    jasonAffection = gs.jasonAffection || 0;
    hasAdvancedPaintKit = gs.hasAdvancedPaintKit || false;
  }
}

function resetGame() {
  localStorage.removeItem("gothamLifeSave");
  hunger = 100;
  money = 100;
  paintings = [];
  actionPoints = 12;
  day = 1;
  currentLocation = "apartment";
  jasonAffection = 0;
  hasAdvancedPaintKit = false;
  updateStatus();
}

// ============ UI更新 & 检查游戏结束 ============
function updateStatus() {
  document.getElementById("day").innerText = day;
  document.getElementById("ap").innerText = actionPoints;
  document.getElementById("hunger").innerText = hunger;
  document.getElementById("money").innerText = money;
  document.getElementById("paintings").innerText = paintings.length;

  // 饥饿检查
  if (hunger <= 0) {
    alert("你因饥饿过度晕倒了，游戏结束。");
    resetGame();
    return;
  }

  // 每次更新完就存档
  saveGame();

  // 每次更新完，根据地点渲染对应按钮
  renderActionsByLocation();
}

// ============ 切换地点函数 (不消耗AP可自己设置) ============
function travelToLocation(locKey) {
  // 如果要在切换地点时消耗AP，可以在此处理
  if (actionPoints < 1) {
    showJasonDialogue("你太累了，走不动了。");
    return;
  }
  actionPoints -= 1;

  currentLocation = locKey;
  updateStatus();

  let desc = locations[locKey].description;
  document.getElementById("jasonDialogue").innerText = 
    `你来到了【${locations[locKey].name}】。\n${desc}`;

  let eventLog = document.getElementById("eventLog");
  if (eventLog) {
    eventLog.innerText = "事件：" + placeRandomEvent(locKey);
  }
}

// 依据地点选一个随机事件
function placeRandomEvent(locKey) {
  const placeEvents = {
    apartment: [
      "邻居的电视声很大，让你休息不太安稳。",
      "你发现旧报纸上有关于红头罩的报道。",
      "楼道灯泡再次坏了，你只能摸黑回房。"
    ],
    street: [
      "街头有人在卖廉价啤酒。",
      "你看到小混混们正在打劫路人。",
      "一阵大雨让你措手不及。"
    ],
    blackMarket: [
      "你看到有人在私下卖违禁武器。",
      "一个神秘商人向你推销奇怪的化学药剂。",
      "空气里弥漫着危险的气息。"
    ]
  };
  if (!placeEvents[locKey]) {
    return randomEvent();
  }
  let arr = placeEvents[locKey];
  let i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

// ============ 递进式：根据地点显示不同按钮 ============
function renderActionsByLocation() {
  const actionContainer = document.getElementById("actionContainer");
  if (!actionContainer) return;

  // 先清空按钮
  actionContainer.innerHTML = "";

  // 不同地点可使用的动作
  let actionList = [];

  if (currentLocation === "apartment") {
    actionList = [
      { label: "画画", fn: draw },
      { label: "吃饭", fn: eat }
    ];
  } else if (currentLocation === "street") {
    actionList = [
      { label: "打工", fn: work },
      { label: "进入商店", fn: openStreetShop }, // 新增：街头商店
      { label: "闲逛", fn: wander }
    ];
  } else if (currentLocation === "blackMarket") {
    actionList = [
      { label: "卖画", fn: sellPainting }
    ];
  }

  // 通用操作：查看画作、捡道具、查看背包、结束一天、重置游戏等
  // 这些你可以随时可见，也可按需只在某些地点显示
  let commonActions = [
    { label: "查看画作", fn: viewPaintings },
    { label: "捡一个道具", fn: acquireItem },
    { label: "查看背包", fn: viewBackpack },
    { label: "结束一天", fn: endDay },
    { label: "重置游戏", fn: resetGame }
  ];

  // 合并地点专属动作 + 通用动作
  let finalActions = actionList.concat(commonActions);

  // 动态生成按钮
  finalActions.forEach(act => {
    let btn = document.createElement("button");
    btn.textContent = act.label;
    btn.onclick = act.fn;
    actionContainer.appendChild(btn);
  });
}

// ============ 街头商店示例 ============
function openStreetShop() {
  // 弹出一个简单的商店UI或对话
  // 这里用prompt做演示，实际可用更好的方式
  let shopMsg =
    "【街头商店】\n" +
    "1) 高级画材($50) - 提高下次画画价值\n" +
    "2) 礼物($30) - 提升杰森好感度\n" +
    "请输入要购买的编号(1或2)，或按取消退出。";
  let choice = prompt(shopMsg);
  if (!choice) return; // 取消或空输入，退出

  if (choice === "1") {
    if (money < 50) {
      showJasonDialogue("你没足够的钱买高级画材。");
      return;
    }
    money -= 50;
    hasAdvancedPaintKit = true; 
    showJasonDialogue("你购买了高级画材，下次画画时会提高价值。");
    updateStatus();
  } else if (choice === "2") {
    if (money < 30) {
      showJasonDialogue("你没足够的钱买礼物。");
      return;
    }
    money -= 30;
    jasonAffection += 5; // 提升杰森好感度
    showJasonDialogue("你买了一份小礼物，准备下次见到杰森送他。");
    updateStatus();
  } else {
    showJasonDialogue("你没有购买任何物品。");
  }
}

// ============ 对话相关(杰森) ============
function showJasonDialogue(dialogue) {
  let box = document.getElementById("jasonDialogue");
  if (!box) {
    console.error("找不到 jasonDialogue 容器");
    return;
  }
  box.innerHTML = "";
  let idx = 0;
  if (typingTimeout) clearTimeout(typingTimeout);

  function typeNext() {
    if (idx < dialogue.length) {
      box.innerHTML += dialogue[idx];
      idx++;
      typingTimeout = setTimeout(typeNext, 40);
    } else {
      typingTimeout = null;
    }
  }
  typeNext();
}

function chatWithJason() {
    let savedDialogue = localStorage.getItem("jasonDialogue");
    if (savedDialogue) {
        // 如果当天已经生成过，就直接显示
        showJasonDialogue(savedDialogue);
        return;
    }

    let dialogues = [
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
        "杰森：如果有一天，我突然消失了……\n他的话停在半空中，似乎在等你的反应。然后他笑了笑，'没事，随便问问。'",
        "杰森：你太相信人了。\n他低头看着你，眼神有点复杂。'有些人，哪怕笑着递给你糖果，下一秒也可能在背后捅你一刀。'",
        "杰森：你需要休息。\n他的语气里带着一丝不容拒绝的意味，像是在命令你。'别跟我争，你眼下的黑眼圈已经说明了一切。'",
        "杰森：今晚别待在这儿。\n他靠在门框上，双手抱胸，表情严肃。'外面有人在盯着你，我不喜欢这个感觉。'",
        "杰森：你会不会后悔？\n他突然问，语气很轻，像是怕打破什么脆弱的东西。'待在这里，和我这种人扯上关系。'",
        "杰森：我不是英雄。\n他低头笑了一下，但笑意没到眼底。'如果你一直把我当成什么正义的骑士，那你迟早会失望的。'",
        "杰森：你让我想起以前的自己。\n他突然停下来，看着你，嘴角的笑意淡了些。'只不过……你比我更勇敢一点。'",
        "杰森：别总是试图拯救别人。\n他的语气不像是在责备，反倒有些无奈。'有些人，不值得。'他顿了一下，'或者说，他们不想被救。'",
        "杰森：如果你害怕，就告诉我。\n他低头看着你，眼神里没有嘲讽，只有认真。'别装作什么都无所谓，我可不是那么好骗的。'",
        "杰森：夜晚的哥谭，有些时候比白天更安全。\n他嘴角挂着一丝若有若无的笑，'因为所有真正危险的家伙，白天也不会消失。'",
        "杰森：你信命运吗？\n他漫不经心地问，手里转着一把小刀。'我是说，这座城市好像总是能把相似的人拉到一起……不管他们愿不愿意。'",
        "杰森：你不该一个人待着。\n他轻叹了一口气，'但我知道，你也不会听我的。'然后他把外套扔到你身上，'至少别着凉。'"
    ];
  let d = dialogues[Math.floor(Math.random() * dialogues.length)];
  localStorage.setItem("jasonDialogue", d);
  showJasonDialogue(d);
}

// ============ 通用随机事件(若地点无专属事件时用) ============
function randomEvent() {
    let events = [
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

// ============ 操作函数：吃饭、打工、画画、卖画等 ============
function eat() {
  if (actionPoints < 1) {
    showJasonDialogue("你太累了，无法再行动。");
    return;
  }
  if (money < 10) {
    showJasonDialogue("你没有足够的钱吃饭。");
    return;
  }
  if (currentLocation !== "apartment") {
    showJasonDialogue("你需要在公寓才能吃饭。");
    return;
  }
  money -= 10;
  hunger += 30;
  actionPoints -= 1;
  showJasonDialogue("你吃了一顿饭，恢复了体力。");
  updateStatus();
}

function work() {
  if (actionPoints < 3) {
    showJasonDialogue("你太累了，无法工作。");
    return;
  }
  if (currentLocation !== "street") {
    showJasonDialogue("只能在街头打工。");
    return;
  }
  actionPoints -= 3;
  hunger -= 10;
  money += 30;
  showJasonDialogue("你在街头做了零工，赚到一些钱。");
  updateStatus();
}

/** 画画：若买了高级画材则提高价值 */
function draw() {
  if (actionPoints < 2) {
    showJasonDialogue("你没有足够的精力作画。");
    return;
  }
  if (currentLocation !== "apartment") {
    showJasonDialogue("你需要在公寓才能安心作画。");
    return;
  }
  actionPoints -= 2;
  hunger -= 10;

  let quality = Math.floor(Math.random() * 100) + 1;
  let baseValue = quality * 2;

  // 若有高级画材，加成50%
  let finalValue = hasAdvancedPaintKit ? Math.floor(baseValue * 1.5) : baseValue;
  // 用完后就归false，表示只有一次加成
  hasAdvancedPaintKit = false;

  let paintingName = prompt("给这幅画取个名字吧？") || "未命名";

  let styleOptions = ["写实派","抽象派","波普艺术","印象派"];
  let chosenStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];

  let desc = "色彩大胆，展现了哥谭的阴郁氛围。";
  
  paintings.push({
    name: paintingName,
    style: chosenStyle,
    desc: desc,
    quality: quality,
    value: finalValue
  });

  showJasonDialogue(
    `你完成了新画作：《${paintingName}》\n风格：${chosenStyle}\n质量：${quality}\n价值：$${finalValue}`
  );

  updateStatus();
}

/** 在黑市卖画 */
function sellPainting() {
  if (currentLocation !== "blackMarket") {
    showJasonDialogue("只能在黑市卖画。");
    return;
  }
  if (paintings.length === 0) {
    showJasonDialogue("你没有画作可卖。");
    return;
  }
  let painting = paintings.shift(); 
  money += painting.value;
  showJasonDialogue(`你卖出《${painting.name}》，获得$${painting.value}`);
  updateStatus();
}

// 闲逛
function wander() {
  if (actionPoints < 1) {
    showJasonDialogue("你没有足够的精力继续闲逛。");
    return;
  }
  if (currentLocation !== "street") {
    showJasonDialogue("只能在街头随处闲逛。");
    return;
  }
  actionPoints -= 1;
  hunger -= 5;
  let chance = Math.random();
  if (chance < 0.3) {
    money += 10;
    showJasonDialogue("你在角落里捡到10美元，真是走运！");
  } else {
    showJasonDialogue("你随处转悠，但没啥收获。");
  }
  updateStatus();
}

// 查看画作
function viewPaintings() {
  if (paintings.length === 0) {
    showJasonDialogue("你当前没有任何画作。");
    return;
  }
  let msg = "你的画作列表：\n";
  paintings.forEach((p, i) => {
    msg += `【${i+1}】《${p.name}》 - 价值:$${p.value}\n`;
  });
  showJasonDialogue(msg);
}

// 背包示例
let backpack = [];

function acquireItem() {
  if (actionPoints < 1) {
    showJasonDialogue("你太累了，无法再捡东西。");
    return;
  }
  actionPoints -= 1;
  const items = ["旧报纸", "破损小刀", "奇怪的面具", "咖啡券", "神秘钥匙"];
  let got = items[Math.floor(Math.random() * items.length)];
  backpack.push(got);
  showJasonDialogue(`你捡到一个【${got}】并放进背包。`);
  updateStatus();
}

function viewBackpack() {
  if (backpack.length === 0) {
    showJasonDialogue("背包空空如也。");
    return;
  }
  let msg = "背包里的东西：\n";
  backpack.forEach((it, i) => {
    msg += `(${i+1}) ${it}\n`;
  });
  showJasonDialogue(msg);
}

// 结束一天
function endDay() {
  actionPoints = 12;
  day += 1;
  hunger -= 20;
  // 每天对话重置
  localStorage.removeItem("jasonDialogue");
  updateStatus();
  document.getElementById("eventLog").innerText = "今日事件：" + randomEvent();
  chatWithJason();
}

// ============ 将函数挂到 window (若有需要) ============
window.travelToLocation = travelToLocation; 
window.eat = eat;
window.work = work;
window.draw = draw;
window.sellPainting = sellPainting;
window.wander = wander;
window.viewPaintings = viewPaintings;
window.acquireItem = acquireItem;
window.viewBackpack = viewBackpack;
window.endDay = endDay;
window.resetGame = resetGame;

// ============ 初始化 ============
document.addEventListener("DOMContentLoaded", () => {
  loadGame();
  updateStatus(); // 会触发renderActionsByLocation，生成按钮

  // 页面加载后不额外扣AP，只是刷新UI
  // 并显示初始地点对话
  document.getElementById("jasonDialogue").innerText = 
    `你身处【${locations[currentLocation].name}】\n${locations[currentLocation].description}`;
  document.getElementById("eventLog").innerText = "事件：" + placeRandomEvent(currentLocation);

  // 生成今天的杰森对话
  chatWithJason();
});
