console.log("app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;

// **加载存档**
loadGame();
updateStatus();

// **更新 UI**
function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;

    // **饱食度为 0 时游戏结束**
    if (hunger <= 0) {
        alert("你因饥饿过度晕倒了，游戏结束。");
        resetGame();
    }

    saveGame(); // **自动保存进度**
}

// **结束一天**
function endDay() {
    actionPoints = 12;
    day += 1;
    hunger -= 20;

    updateStatus();

    // **触发随机事件**
    randomEvent();

    // **触发杰森对话**
    chatWithJason();
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

// **扩展杰森的随机对话**
function chatWithJason() {
    let dialogues = [
        {
            text: "杰森：哥谭的街头永远不安全。",
            effect: () => hunger -= 5
        },
        {
            text: "杰森：今天遇到了迪克，我们聊了聊。",
            effect: () => money += 10
        },
        {
            text: "杰森：如果有一天，你会选择离开哥谭吗？",
            effect: () => actionPoints += 1
        },
        {
            text: "杰森：你应该更注意自己的安全。",
            effect: () => hunger += 5
        },
        {
            text: "杰森：哥谭是个没有英雄的地方。",
            effect: () => money -= 10
        },
        {
            text: "杰森：红头罩这个名字，你怎么看？",
            effect: () => {
                let choice = confirm("你要回答他吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "杰森沉默了一会儿，点了点头。";
                    actionPoints += 2;
                } else {
                    document.getElementById("jasonDialogue").innerText = "杰森耸耸肩：“也许你以后会有答案。”";
                }
            }
        }
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    document.getElementById("jasonDialogue").innerText = dialogue.text;
    dialogue.effect();
    updateStatus();
}

// **吃饭**
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

// **工作**
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

// **画画**
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

// **绑定按钮**
window.eat = eat;
window.work = work;
window.draw = draw;
window.sellPainting = sellPainting;
window.endDay = endDay;

// **初始化状态**
updateStatus();
