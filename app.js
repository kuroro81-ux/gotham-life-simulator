console.log("📢 app.js 已成功加载！");

// 角色状态
let hunger = 100; // 饱食度
let money = 100; // 资金
let paintings = []; // 画作库存
let actionPoints = 12; // 每天行动点
let day = 1; // 当前天数

// **等待 HTML 加载后执行**
document.addEventListener("DOMContentLoaded", function () {
    console.log("🌍 DOM 已加载");

    // **更新 UI**
    function updateStatus() {
        document.getElementById("day").innerText = day;
        document.getElementById("ap").innerText = actionPoints;
        document.getElementById("hunger").innerText = hunger;
        document.getElementById("money").innerText = money;
        document.getElementById("paintings").innerText = paintings.length;
        console.log("✅ 状态已更新");
    }

    // **随机事件系统**
    function randomEvent() {
        let events = [
            { 
                name: "🎨 灵感爆发", 
                effect: () => {
                    alert("💡 你突发灵感！今天画作质量提升！");
                    paintings.forEach(p => p.quality += 10); // 所有画作质量+10
                }
            },
            { 
                name: "📉 市场萧条", 
                effect: () => {
                    alert("📉 经济危机来袭！画作价值下降！");
                    paintings.forEach(p => p.value = Math.floor(p.value * 0.7)); // 所有画作价值-30%
                }
            },
            { 
                name: "💰 黑市买家", 
                effect: () => {
                    if (paintings.length > 0) {
                        let highPrice = paintings[0].value * 2;
                        money += highPrice;
                        paintings.shift();
                        alert(`💰 黑市买家收购了一幅画，获得 $${highPrice}！`);
                    } else {
                        alert("💰 黑市买家来了，但你没有画作可卖！");
                    }
                }
            },
            { 
                name: "⚡ 体力透支", 
                effect: () => {
                    alert("⚠️ 你昨天太过劳累，今天 AP 减少 3！");
                    actionPoints = Math.max(0, actionPoints - 3);
                }
            },
            { 
                name: "🍔 食物中毒", 
                effect: () => {
                    alert("🤢 你吃了变质的食物，饱食度大幅下降！");
                    hunger = Math.max(0, hunger - 30);
                }
            }
        ];

        let event = events[Math.floor(Math.random() * events.length)];
        alert(`📢 今日事件：${event.name}`);
        event.effect();
        updateStatus();
    }

    // **结束一天**
    function endDay() {
        actionPoints = 12;
        day += 1;
        hunger -= 20; // 过一天减少饱食度

        alert(`🌅 新的一天开始了！今天是第 ${day} 天。\n⚠️ 饱食度减少 20，请注意补充食物！`);

        // 触发随机事件
        randomEvent();

        // 触发与杰森的对话
        chatWithJason();

        updateStatus();
    }

    // **与杰森的对话系统**
    function chatWithJason() {
        let dialogues = [
            {
                text: "🖤 杰森靠在窗边，点燃了一根烟，语气平静：“今天过得怎么样？”",
                effect: () => alert("💭 你和杰森聊了一会儿，感觉安心了一些。")
            },
            {
                text: "🔥 杰森低头擦拭着他的枪，眼神有些犹豫：“如果有一天，我不得不离开……你会怎么办？”",
                effect: () => {
                    let choice = confirm("💬 你要安慰他吗？");
                    if (choice) {
                        alert("💖 你握住了杰森的手，他笑了笑：“我不会真的走。”");
                    } else {
                        alert("💀 杰森沉默了一会儿，没有再继续这个话题。");
                    }
                }
            },
            {
                text: "🏍 杰森擦拭着他的摩托车，眼神有些怀念：“哥谭的街道……你知道这里曾经发生过什么吗？”",
                effect: () => {
                    alert("🏙 他向你讲述了哥谭最黑暗的时期——无政府时期、黑帮横行的夜晚。");
                }
            },
            {
                text: "🩸 “你听过红头罩的故事吗？”杰森的声音低沉。",
                effect: () => {
                    let choice = confirm("💬 你要让他继续讲下去吗？");
                    if (choice) {
                        alert("📖 你听着他的故事，关于一个被命运玩弄的少年，关于一场改变一切的悲剧。");
                    } else {
                        alert("🚬 杰森叹了口气：“或许有一天你会想听。”");
                    }
                }
            }
        ];

        let dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];
        alert(`📢 与杰森的对话：\n${dialogue.text}`);
        dialogue.effect();
    }

    // **吃饭（扣除金钱 $10，增加 20 饱食度）**
    function eat() {
        if (money < 10) {
            alert("💰 你的钱不够吃饭！");
            return;
        }
        money -= 10;
        hunger += 20;
        alert("🍽 你吃了一顿饭，恢复 20 饱食度，但扣除了 $10！");
        updateStatus();
    }

    // **找工作（消耗 3 AP，赚取 $30，减少 10 饱食度）**
    function work() {
        if (actionPoints < 3) {
            alert("⚠️ 你的 AP 不足！");
            return;
        }
        actionPoints -= 3;
        hunger -= 10;
        money += 30;
        alert("💰 你工作了一天，赚了 $30！");
        updateStatus();
    }

    // **画画（消耗 2 AP，消耗 10 饱食度，新增一幅画）**
    function draw() {
        if (actionPoints < 2) {
            alert("⚠️ 你的 AP 不足！");
            return;
        }
        actionPoints -= 2;
        hunger -= 10;
        let quality = Math.floor(Math.random() * 100) + 1;
        let value = quality * 2;
        paintings.push({ quality: quality, value: value });
        alert(`🖌 你画了一幅画！\n🎨 质量: ${quality}  💲价值: $${value}`);
        updateStatus();
    }

    // **确保 HTML 按钮可以调用这些函数**
    window.eat = eat;
    window.work = work;
    window.draw = draw;
    window.endDay = endDay;

    // **初始化状态**
    updateStatus();
});
