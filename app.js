console.log("📢 app.js 已成功加载！");

// 角色状态
let hunger = 100;
let money = 100;
let paintings = []; // 存放画作

// 获取状态显示元素
let statusElement = document.getElementById("status");

// 更新状态
function updateStatus() {
    if (statusElement) {
        statusElement.innerText = `当前饱食度: ${hunger} | 资金: $${money} | 画作数量: ${paintings.length}`;
    } else {
        console.error("⚠️ 无法找到 status 元素，请检查 HTML 代码！");
    }
}

// 吃饭
function eat() {
    console.log("🍽 吃饭按钮被点击");
    hunger += 20;
    updateStatus();
}

// 找工作
function work() {
    console.log("💼 找工作按钮被点击");
    hunger -= 10;
    updateStatus();
}

// 画画
function draw() {
    console.log("🎨 画画按钮被点击");

    if (hunger <= 0) {
        alert("你太饿了，无法画画！");
        return;
    }

    hunger -= 10;
    let quality = Math.floor(Math.random() * 100) + 1;
    let value = quality * 2;

    let painting = { id: paintings.length + 1, quality: quality, value: value };
    paintings.push(painting);
    updateStatus();
    alert(`你画了一幅画！\n质量: ${quality} 价值: $${value}`);
}

// 出售画作
function sellPainting() {
    console.log("🖼 出售画作按钮被点击");

    if (paintings.length === 0) {
        alert("你没有画可以卖！");
        return;
    }

    let painting = paintings.shift();
    money += painting.value;
    updateStatus();
    alert(`你卖掉了一幅画，赚了 $${painting.value}`);
}

// **初始化状态**
updateStatus();
