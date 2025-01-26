let hunger = 100;
let status = document.getElementById("status");

function updateStatus() {
    status.innerText = `当前饱食度: ${hunger}`;
}

function eat() {
    hunger += 20;
    updateStatus();
}

function work() {
    hunger -= 10;
    updateStatus();
}

function draw() {
    hunger -= 5;
    updateStatus();
}

updateStatus();

let paintings = []; // 存放画作
let money = 100; // 初始资金

function draw() {
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

function sellPainting() {
    if (paintings.length === 0) {
        alert("你没有画可以卖！");
        return;
    }

    let painting = paintings.shift(); // 卖掉最早的一幅画
    money += painting.value;
    updateStatus();
    alert(`你卖掉了一幅画，赚了 $${painting.value}`);
}

function updateStatus() {
    document.getElementById("status").innerText = 
        `当前饱食度: ${hunger} | 资金: $${money} | 画作数量: ${paintings.length}`;
}
