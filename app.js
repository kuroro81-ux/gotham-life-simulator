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
    let eventText = randomEvent();
    document.getElementById("eventLog").innerText = `今日事件：${eventText}`;

    // **触发杰森对话**
    let jasonText = chatWithJason();
    document.getElementById("jasonDialogue").innerText = jasonText;
}

// **随机事件系统**
function randomEvent() {
    let events = [
        {
            text: "你在回家的路上被陌生人拦住，他似乎需要帮助。",
            effect: () => {
                let choice = confirm("你要帮助他吗？");
                if (choice) {
                    money += 20;
                    return "你帮助了陌生人，他给了你 $20 作为感谢。";
                } else {
                    return "你无视了陌生人，快速离开了。";
                }
            }
        },
        {
            text: "你遇到了一个正在涂鸦的孩子，他似乎很喜欢艺术。",
            effect: () => {
                actionPoints += 1;
                return "你和孩子聊了一会儿，心情变好了（+1 AP）。";
            }
        },
        {
            text: "你在街上被一个小偷盯上了！",
            effect: () => {
                let loss = Math.floor(Math.random() * 20) + 10;
                money -= loss;
                return `小偷抢走了 $${loss}！`;
            }
        },
        {
            text: "你在垃圾桶里发现了一些剩饭。",
            effect: () => {
                let choice = confirm("你要吃掉它吗？");
                if (choice) {
                    hunger += 10;
                    return "你吃了剩饭，恢复了一些饱食度。";
                } else {
                    return "你选择不吃，继续前进。";
                }
            }
        }
    ];

    let event = events[Math.floor(Math.random() * events.length)];
    return event.effect();
}

// **扩展杰森的随机对话**
function chatWithJason() {
    let dialogues = [
        {
            text: "杰森：哥谭的街头永远不安全。",
            effect: () => {
                hunger -= 5;
                return "你感到一阵不安，警惕地环顾四周。";
            }
        },
        {
            text: "杰森：今天遇到了迪克，我们聊了聊。",
            effect: () => {
                money += 10;
                return "迪克似乎给了杰森一点钱，你意外地分到了一些。";
            }
        },
        {
            text: "杰森：如果有一天，你会选择离开哥谭吗？",
            effect: () => {
                actionPoints += 1;
                return "你陷入沉思，似乎有些犹豫。";
            }
        },
        {
            text: "杰森：你应该更注意自己的安全。",
            effect: () => {
                hunger += 5;
                return "你感觉自己受到了照顾。";
            }
        },
        {
            text: "杰森：哥谭是个没有英雄的地方。",
            effect: () => {
                money -= 10;
                return "杰森的话让你感到一丝沉重。";
            }
        },
        {
            text: "杰森：红头罩这个名字，你怎么看？",
            effect: () => {
                let choice = confirm("你要回答他吗？");
                if (choice) {
                    actionPoints += 2;
                    return "杰森沉默了一会儿，点了点头。";
                } else {
                    return "杰森耸耸肩：“也许你以后会有答案。”";
                }
            }
        }
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    return dialogue.effect();
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
