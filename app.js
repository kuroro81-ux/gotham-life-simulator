console.log("📢 app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = []; // 存放画作
let actionPoints = 12; // 每天的行动点数
let day = 1; // 记录当前天数

// **等待 HTML 载入后执行**
document.addEventListener("DOMContentLoaded", function() {
    let statusElement = document.getElementById("status");

    // **更新状态 UI**
    function updateStatus() {
    document.getElementById("day").innerText = day;
    document.getElementById("ap").innerText = actionPoints;
    document.getElementById("hunger").innerText = hunger;
    document.getElementById("money").innerText = money;
    document.getElementById("paintings").innerText = paintings.length;

    // 更新状态栏颜色（动态变化）
    let hungerElement = document.querySelector(".hunger-display");
    let moneyElement = document.querySelector(".money-display");

    // 根据饱食度变化颜色
    if (hunger > 60) {
        hungerElement.style.background = "#ff4500"; // 正常（红色）
    } else if (hunger > 30) {
        hungerElement.style.background = "#ffa500"; // 低（橙色）
    } else {
        hungerElement.style.background = "#ff0000"; // 危险（深红）
    }

    // 根据金钱变化颜色
    if (money >= 500) {
        moneyElement.style.background = "#ffd700"; // 富有（黄金色）
    } else if (money >= 100) {
        moneyElement.style.background = "#daa520"; // 正常（深金色）
    } else {
        moneyElement.style.background = "#8b0000"; // 破产（暗红色）
    }
            
            // 如果 AP 为 0，提醒玩家必须结束一天
            if (actionPoints <= 0) {
                alert("⚠️ 你的 AP 已用完！请点击 '结束一天' 按钮恢复 AP。");
                disableActions();
            } else {
                enableActions();
            }
        } else {
            console.error("⚠️ 无法找到 status 元素，请检查 HTML 代码！");
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

    // **结束一天，恢复 AP，并触发随机事件**
    function endDay() {
        actionPoints = 12;
        day += 1;
        hunger -= 20; // 过一天减少饱食度

        alert(`🌅 新的一天开始了！今天是第 ${day} 天。\n你的 AP 已恢复为 12。\n⚠️ 饱食度减少 20，请注意补充食物！`);

        // **触发随机事件**
        randomEvent();

        updateStatus();
    }

    // **消耗 AP 的通用函数**
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
        console.log("🍽 吃饭按钮被点击");
        hunger += 20;
        updateStatus();
    }

    // **找工作（消耗 3 AP）**
    function work() {
        console.log("💼 找工作按钮被点击");

        if (!consumeAP(3)) return;

        hunger -= 10;
        money += 30; // 找工作赚钱
        alert("💰 你工作了一天，赚了 $30！");
        updateStatus();
    }

    // **画画（消耗 2 AP）**
    function draw() {
        console.log("🎨 画画按钮被点击");

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
        console.log("🖼 出售画作按钮被点击");

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
                        paintings = []; // 清空画作
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
