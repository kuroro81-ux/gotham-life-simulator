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
                name: "🏛 画廊经理拜访", 
                effect: () => {
                    if (paintings.length >= 2) {
                        alert("🏛 画廊经理看中你的作品，愿意高价收购！");
                        money += paintings.length * 60; // 每幅画卖$60
                        paintings = [];
                    } else {
                        alert("🏛 画廊经理来了，但你画作太少...");
                    }
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
        updateStatus();
    }

    // **行动函数**
    function consumeAP(amount) {
        if (actionPoints < amount) {
            alert("⚠️ 你的 AP 不足，必须结束一天才能恢复！");
            return false;
        }
        actionPoints -= amount;
        updateStatus();
        return true;
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
        if (!consumeAP(3)) return;
        hunger -= 10;
        money += 30;
        alert("💰 你工作了一天，赚了 $30！");
        updateStatus();
    }

    // **画画（消耗 2 AP，消耗 10 饱食度，新增一幅画）**
    function draw() {
        if (!consumeAP(2)) return;
        hunger -= 10;
        let quality = Math.floor(Math.random() * 100) + 1;
        let value = quality * 2;
        paintings.push({ id: paintings.length + 1, quality: quality, value: value });
        alert(`🖌 你画了一幅画！\n🎨 质量: ${quality}  💲价值: $${value}`);
        updateStatus();
    }

    // **出售画作（获得金钱）**
    function sellPainting() {
        if (paintings.length === 0) {
            alert("⚠️ 你没有画可以卖！");
            return;
        }
        let painting = paintings.shift();
        money += painting.value;
        alert(`✅ 你卖掉了一幅画，赚了 $${painting.value}`);
        updateStatus();
    }

    // **确保 HTML 按钮可以调用这些函数**
    window.eat = eat;
    window.work = work;
    window.draw = draw;
    window.sellPainting = sellPainting;
    window.endDay = endDay;

    // **初始化状态**
    updateStatus();
});
