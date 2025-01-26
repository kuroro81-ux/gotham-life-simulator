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

    // **结束一天**
    function endDay() {
        actionPoints = 12;
        day += 1;
        hunger -= 20;
        alert(`🌅 新的一天开始了！\n今天是第 ${day} 天。\n你的 AP 已恢复！\n⚠️ 饱食度减少 20，请注意补充食物！`);
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

    function eat() {
        hunger += 20;
        updateStatus();
    }

    function work() {
        if (!consumeAP(3)) return;
        hunger -= 10;
        money += 30;
        alert("💰 你工作了一天，赚了 $30！");
        updateStatus();
    }

    function draw() {
        if (!consumeAP(2)) return;
        hunger -= 10;
        let quality = Math.floor(Math.random() * 100) + 1;
        let value = quality * 2;
        paintings.push({ id: paintings.length + 1, quality: quality, value: value });
        alert(`🖌 你画了一幅画！\n🎨 质量: ${quality}  💲价值: $${value}`);
        updateStatus();
    }

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
