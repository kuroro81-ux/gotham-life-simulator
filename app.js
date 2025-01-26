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
