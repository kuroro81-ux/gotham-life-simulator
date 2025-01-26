// 角色状态
let hunger = 100;
let money = 100;
let paintings = []; // 存放画作
let status = document.getElementById("status");

// 更新状态显示
function updateStatus() {
    if (status) {
        status.innerText = `当前饱食度: ${hunger} | 资金: $${money} | 画作数量: ${paintings.length}`;
    } else {
        console.error("无法找到 status 元素，检查 HTML 代码是否有 <p id='status'></p>");
    }
}

// 吃饭，恢复饱食度
function eat() {
    console.log("吃饭按钮被点击");
    hunger += 20;
    updateStatus();
}

// 找工作，消耗饱食度但不赚钱（未来可扩展）
function work() {
    console.log("找工作按钮被点击");
    hunger -= 10;
    updateStatus();
}

// 画画功能
function draw() {
    console.log("画画按钮被点击");

    if (hunger <= 0) {
        alert("你太饿了，无法画画！");
        return;
    }

    hunger -= 10; // 画画消耗饱食度
    let quality = Math.floor(Math.random() * 100) + 1; // 画作质量（1-100）
    let value = quality * 2; // 画作市场价值

    let painting = {
        id: paintings.length + 1,
        quality: quality,
        value: value
    };

    paintings.push(painting);
    updateStatus();
    alert(`你画了一幅画！\n质量: ${quality} 价值: $${value}`);
}

// 出售画作
function sellPainting() {
    console.log("出售画作按钮被点击");

    if (paintings.length === 0) {
        alert("你没有画可以卖！");
        return;
    }

    let painting = paintings.shift(); // 卖掉最早的一幅画
    money += painting.value;
    updateStatus();
    alert(`你卖掉了一幅画，赚了 $${painting.value}`);
}

// 初始状态更新
updateStatus();
