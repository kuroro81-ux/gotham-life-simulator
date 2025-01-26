console.log("📢 app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = [];
let actionPoints = 12;
let day = 1;

// **等待 HTML 加载后执行**
document.addEventListener("DOMContentLoaded", function() {
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
            { name: "🎨 灵感爆发", effect: () => alert("💡 你突发灵感！今天画作质量提升！") },
            { name: "📉 市场萧条", effect: () => alert("📉 经济危机来袭！画作价值下降！") },
            { name: "🏛 画廊经理拜访", effect: () => alert("🏛 画廊经理来访，可能会收购你的画！") },
            { name: "💰 黑市买家", effect: () => alert("💰 黑市买家愿意高价购买画作！") }
        ];

        let event = events[Math.floor(Math.random() * events.length)];
        alert(`📢 今日事件：${event.name}`);
        event.effect();
    }

    // **结束一天**
    function endDay() {
        actionPoints = 12;
        day += 1;
        hunger -= 20;
        alert(`🌅 新的一天开始了！今天是第 ${day} 天。\n⚠️ 饱食度减少 20，请注意补充食物！`);
        randomEvent();
        updateStatus();
    }

    // **确保 HTML 按钮可以调用这些函数**
    window.eat = () => { hunger += 20; updateStatus(); };
    window.work = () => { if (actionPoints >= 3) { actionPoints -= 3; money += 30; hunger -= 10; updateStatus(); } };
    window.draw = () => { if (actionPoints >= 2) { actionPoints -= 2; hunger -= 10; paintings.push({ quality: Math.random() * 100 }); updateStatus(); } };
    window.sellPainting = () => { if (paintings.length > 0) { money += 50; paintings.pop(); updateStatus(); } };
    window.endDay = endDay;

    updateStatus();
});
