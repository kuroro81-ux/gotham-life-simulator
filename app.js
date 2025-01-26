console.log("app.js 已成功加载！");

// 角色状态
let hunger = 100; // 饱食度
let money = 100; // 资金
let paintings = []; // 画作库存
let actionPoints = 12; // 每天行动点
let day = 1; // 当前天数

// 更新 UI
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;
}

// 结束一天
function endDay() {
    actionPoints = 12;
    day += 1;
    hunger -= 20; // 过一天减少饱食度

    updateStatus();

    // 触发随机事件
    randomEvent();

    // 触发与杰森的对话
    chatWithJason();
}

// 随机事件
function randomEvent() {
    let events = [
        { name: "灵感爆发", effect: () => paintings.forEach(p => p.quality += 10) },
        { name: "市场萧条", effect: () => paintings.forEach(p => p.value *= 0.7) },
        { name: "黑市买家", effect: () => money += 50 },
        { name: "体力透支", effect: () => actionPoints = Math.max(0, actionPoints - 3) }
    ];

    let event = events[Math.floor(Math.random() * events.length)];
    document.getElementById("jasonDialogue").innerText = `今日事件：${event.name}`;
    event.effect();
}

// 与杰森的对话系统
function chatWithJason() {
    let dialogues = [
        {
            text: "杰森：今天过得怎么样？",
            effect: () => hunger += 5
        },
        {
            text: "杰森：如果有一天，我不得不离开……你会怎么办？",
            effect: () => {
                let choice = confirm("你要安慰他吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "你握住了杰森的手，他轻笑了一下。";
                    actionPoints += 2;
                } else {
                    document.getElementById("jasonDialogue").innerText = "杰森沉默了，没有再继续这个话题。";
                }
            }
        },
        {
            text: "杰森：哥谭的夜晚总是这么冷。",
            effect: () => actionPoints += 1
        },
        {
            text: "杰森：你知道吗？以前的我不喜欢用枪。",
            effect: () => money += 10
        },
        {
            text: "杰森：你听过红头罩的故事吗？",
            effect: () => {
                let choice = confirm("你要让他继续讲下去吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "你听着他的故事，关于一个被命运玩弄的少年。";
                    actionPoints -= 2;
                } else {
                    document.getElementById("jasonDialogue").innerText = "杰森叹了口气：“或许有一天你会想听。”";
                }
            }
        },
        {
            text: "杰森：哥谭有时候让人喘不过气。",
            effect: () => hunger -= 5
        },
        {
            text: "杰森：今天遇到迪克了，他还是那么烦。",
            effect: () => money += 5
        },
        {
            text: "杰森：我总觉得有人在跟踪我。",
            effect: () => {
                let choice = confirm("你要让他调查吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "杰森点点头：“好，我会留意的。”";
                    actionPoints -= 1;
                } else {
                    document.getElementById("jasonDialogue").innerText = "你选择保持沉默。";
                }
            }
        },
        {
            text: "杰森：如果你有机会离开哥谭，你会走吗？",
            effect: () => actionPoints += 1
        },
        {
            text: "杰森：今天听到了一些地下交易的消息。",
            effect: () => {
                let choice = confirm("你要让他去看看吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "杰森消失了一段时间，回来时带着一笔意外之财。";
                    money += 30;
                } else {
                    document.getElementById("jasonDialogue").innerText = "杰森耸耸肩：“算了，反正也不重要。”";
                }
            }
        }
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    document.getElementById("jasonDialogue").innerText = dialogue.text;
    dialogue.effect();
    updateStatus();
}

// 吃饭
function eat() {
    if (money < 10) {
        document.getElementById("jasonDialogue").innerText = "你没有足够的钱吃饭。";
        return;
    }
    money -= 10;
    hunger += 20;
    document.getElementById("jasonDialogue").innerText = "你吃了一顿饭，恢复了体力。";
    updateStatus();
}

// 工作
function work() {
    if (actionPoints < 3) {
        document.getElementById("jasonDialogue").innerText = "你太累了，无法工作。";
        return;
    }
    actionPoints -= 3;
    hunger -= 10;
    money += 30;
    document.getElementById("jasonDialogue").innerText = "你努力了一天，赚了一些钱。";
    updateStatus();
}

// 画画
function draw() {
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
}

// 绑定按钮
window.eat = eat;
window.work = work;
window.draw = draw;
window.endDay = endDay;

updateStatus();
