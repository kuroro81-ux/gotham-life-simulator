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
    randomEvent();

    // **触发杰森对话**
    chatWithJason();
}

// **随机事件系统**
function randomEvent() {
    let events = [
        {
            text: "你在回家的路上被陌生人拦住，他似乎需要帮助。",
            effect: () => {
                let choice = confirm("你要帮助他吗？");
                if (choice) {
                    document.getElementById("jasonDialogue").innerText = "你帮助了陌生人，他给了你 $20 作为感谢。";
                    money += 20;
                } else {
                    document.getElementById("jasonDialogue").innerText = "你无视了陌生人，快速离开了。";
                }
            }
        },
        {
            text: "你遇到了一个正在涂鸦的孩子，他似乎很喜欢艺术。",
            effect: () => {
                document.getElementById("jasonDialogue").innerText = "你和孩子聊了一会儿，心情变好了。";
                actionPoints += 1;
            }
        },
        {
            text: "你在街上被一个小偷盯上了！",
            effect: () => {
                let loss = Math.floor(Math.random() * 20) + 10;
                document.getElementById("jasonDialogue").innerText = `小偷抢走了 $${loss}！`;
                money -= loss;
            }
        },
        {
            text: "你在垃圾桶里发现了一些剩饭。",
            effect: () => {
                let choice = confirm("你要吃掉它吗？");
                if (choice) {
                    hunger += 10;
                    document.getElementById("jasonDialogue").innerText = "你吃了剩饭，恢复了一些饱食度。";
                } else {
                    document.getElementById("jasonDialogue").innerText = "你选择不吃，继续前进。";
                }
            }
        }
    ];

    let event = events[Math.floor(Math.random() * events.length)];
    document.getElementById("jasonDialogue").innerText = event.text;
    event.effect();
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
        },
        {
            text: "杰森：有时候，我在想如果布鲁斯还在……",
            effect: () => {
                document.getElementById("jasonDialogue").innerText = "你注意到杰森的眼神变得深邃，似乎陷入了回忆。";
                actionPoints += 1;
            }
        },
        {
            text: "杰森：如果你需要钱，可以告诉我。",
            effect: () => {
                let choice = confirm("你要接受他的帮助吗？");
                if (choice) {
                    money += 50;
                    document.getElementById("jasonDialogue").innerText = "杰森递给你一些现金：“拿着，别问。”";
                } else {
                    document.getElementById("jasonDialogue").innerText = "你摇了摇头，杰森叹了口气。";
                }
            }
        }
    ];

    let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
    document.getElementById("jasonDialogue").innerText = dialogue.text;
    dialogue.effect();
    updateStatus();
}

// **绑定按钮**
window.eat = eat;
window.work = work;
window.draw = draw;
window.sellPainting = sellPainting;
window.endDay = endDay;

// **初始化状态**
loadGame();
updateStatus();
