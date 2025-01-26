console.log("📢 app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = []; // 画作列表
let actionPoints = 12; // 每天的行动点
let day = 1; // 当前天数

// **等待 HTML 载入后执行**
document.addEventListener("DOMContentLoaded", function() {
    let statusElement = document.getElementById("status");

    // **更新 UI**
    function updateStatus() {
        document.getElementById("day").innerText = day;
        document.getElementById("ap").innerText = actionPoints;
        document.getElementById("hunger").innerText = hunger;
        document.getElementById("money").innerText = money;
        document.getElementById("paintings").innerText = paintings.length;

        // 更新状态颜色
        let hungerElement = document.querySelector(".hunger-display");
        let moneyElement = document.querySelector(".money-display");

        if (hunger > 60) {
            hungerElement.style.background = "linear-gradient(45deg, #ff9966, #ff5555)";
        } else if (hunger > 30) {
            hungerElement.style.background = "linear-gradient(45deg, #ffcc66, #ff9966)";
        } else {
            hungerElement.style.background = "linear-gradient(45deg, #ff6666, #cc0000)";
        }

        if (money >= 500) {
            moneyElement.style.background = "linear-gradient(45deg, #ffdd77, #ffaa33)";
        } else if (money >= 100) {
            moneyElement.style.background = "linear-gradient(45deg, #ffcc66, #ff9966)";
        } else {
            moneyElement.style.background = "linear-gradient(45deg, #ff3333, #cc0000)";
        }

        // 如果 AP 为 0，禁用行动按钮
        if (actionPoints <= 0) {
            disableActions();
            alert("⚠️ 你的 AP 已用完！请点击 '结束一天' 按钮恢复 AP。");
        } else {
            enableActions();
        }
    }

    // **禁用所有需要 AP 的按钮**
    function disableActions() {
        document.getElementById("workBtn").disabled = true;
        document.getElementById("drawBtn").disabled = true;
    }

    // **启用所有按钮**
    function enableActions() {
        document.getElementById("workBtn").disabled = false;
        document.getElementById("drawBtn").disabled = false;
    }

    // **结束一天**
    function endDay() {
        actionPoints = 12;
        day += 1;
        hunger -= 20; // 过一天减少饱食度

        alert(`🌅 新的一天开始了！今天是第 ${day} 天。\n你的 AP 已恢复为 12。\n⚠️ 饱食度减少 20，请注意补充食物！`);

        // 触发随机事件
        randomEvent();

        updateStatus();
    }

    // **通用 AP 消耗**
    function consumeAP(amount) {
        if (actionPoints < amount) {
            alert("⚠️ 你的 AP 不足，必须结束一天才能恢复！");
            return false;
        }
        actionPoints -= amount;
        updateStatus();
        return true;
    }

    // **吃饭（不消耗 AP）**
    function eat() {
        hunger += 20;
        updateStatus();
    }

    // **找工作（消耗 3 AP）**
    function work() {
        if (!consumeAP(3)) return;
        hunger -= 10;
        money += 30;
        alert("💰 你工作了一天，赚了 $30！");
        updateStatus();
    }

    // **画画（消耗 2 AP）**
    function draw() {
        if (!consumeAP(2)) return;

        if (hunger <= 0) {
            alert("⚠️ 你太饿了，无法画画！");
            return;
        }

        hunger -= 10;
        let quality = Math.floor(Math.random() * 100) + 1;
        let value = quality * 2;

        let painting = { id: paintings.length + 1, quality: quality, value: value };
        paintings.push(painting);
        updateStatus();
        alert(`🖌 你画了一幅画！\n🎨 质量: ${quality}  💲价值: $${value}`);
    }

    // **出售画作（不消耗 AP）**
    function sellPainting() {
        if (paintings.length === 0) {
            alert("⚠️ 你没有画可以卖！");
            return;
        }

        let painting = paintings.shift();
        money += painting.value;
        updateStatus();
        alert(`✅ 你卖掉了一幅画，赚了 $${painting.value}`);
    }

    // **随机事件系统**
    function randomEvent() {
        let events = [
            { 
                name: "🎨 灵感爆发！", 
                effect: () => {
                    alert("💡 你突发灵感！今天画作质量提升 20，但画画会多消耗 1 AP！");
                }
            },
            { 
                name: "📉 市场萧条！", 
                effect: () => {
                    alert("📉 经济危机来袭！所有画作的价值下降 30%！");
                    paintings.forEach(painting => painting.value = Math.floor(painting.value * 0.7));
                }
            },
            { 
                name: "🏛 画廊经理拜访！", 
                effect: () => {
                    if (paintings.length >= 3) {
                        alert("🏛 画廊经理看中了你的作品！他邀请你举办画展，提升声望！");
                        paintings = [];
                    } else {
                        alert("🏛 画廊经理来了，但你没有足够的画作举办展览...");
                    }
                }
            },
            { 
                name: "💰 黑市买家！", 
                effect: () => {
                    if (paintings.length > 0) {
                        let risk = Math.random() < 0.2;
                        let painting = paintings.shift();
                        if (risk) {
                            alert("❌ 你被骗了！黑市买家带走了一幅画，但没付钱！");
                        } else {
                            let highPrice = painting.value * 2;
                            money += highPrice;
                            alert(`💰 黑市买家高价收购了一幅画，获得 $${highPrice}！`);
                        }
                    } else {
                        alert("💰 黑市买家来了，但你没有画作可卖！");
                    }
                }
            }
        ];

        let event = events[Math.floor(Math.random() * events.length)];
        alert(`📢 今日事件：${event.name}`);
        event.effect();
    }

    // **初始化状态**
    updateStatus();

    // **确保 HTML 按钮可以调用这些函数**
    window.eat = eat;
    window.work = work;
    window.draw = draw;
    window.sellPainting = sellPainting;
    window.endDay = endDay;
});
