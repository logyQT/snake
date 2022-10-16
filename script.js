"use strict";

const gameSize = { x: 25, y: 25 };
const cellSize = 20;
const maxFrame = 10;
const subFrameSize = 1 / maxFrame;

const gw = document.querySelector(".game-window");
const scoreElement = document.querySelector(".score");
const ctx = gw.getContext("2d");
gw.width = gameSize.y * cellSize;
gw.height = gameSize.x * cellSize;

let snake = { head: { x: cellSize * 10, y: cellSize * 10 }, body: [] };
let apples = new Array();

let vel = { x: 1, y: 0 };
let vel2 = { x: 0, y: 0 };
let tailDiff = { x: 0, y: 0 };
let headDiff = { x: 0, y: 0 };
let frame = 0;
let score = 0;

const addApple = () => {
    let t = 0;
    let x = Math.floor(Math.random() * gameSize.x) * cellSize;
    let y = Math.floor(Math.random() * gameSize.y) * cellSize;
    while ((snake.head.x == x && snake.head.y == y) || t != 1000) {
        x = Math.floor(Math.random() * gameSize.x) * cellSize;
        y = Math.floor(Math.random() * gameSize.y) * cellSize;
        t++;
    }
    apples.push({ x: x, y: y });
};

const updateScore = () => {
    scoreElement.innerText = "Score: " + score;
};

const draw = () => {
    ctx.clearRect(0, 0, gw.width, gw.height);

    ctx.fillStyle = "red";
    apples.forEach((a) => {
        ctx.fillRect(a.x, a.y, cellSize, cellSize);
    });

    ctx.fillStyle = "lime";
    if (frame == maxFrame) frame = 0;

    if (vel2.x == 1) {
        ctx.fillRect(snake.head.x + cellSize * (subFrameSize * frame) - cellSize, snake.head.y, cellSize, cellSize);
    } else if (vel2.x == -1) {
        ctx.fillRect(snake.head.x - cellSize * (subFrameSize * frame) + cellSize, snake.head.y, cellSize, cellSize);
    } else if (vel2.y == 1) {
        ctx.fillRect(snake.head.x, snake.head.y + cellSize * (subFrameSize * frame) - cellSize, cellSize, cellSize);
    } else if (vel2.y == -1) {
        ctx.fillRect(snake.head.x, snake.head.y - cellSize * (subFrameSize * frame) + cellSize, cellSize, cellSize);
    }
    for (let i = 0; i < snake.body.length; i++) {
        ctx.fillRect(snake.body[i].x, snake.body[i].y, cellSize, cellSize);
    }
    if (snake.body.length == 1) {
        tailDiff.x = snake.head.x - snake.body[snake.body.length - 1].x;
        tailDiff.y = snake.head.y - snake.body[snake.body.length - 1].y;
    } else if (snake.body.length > 1) {
        tailDiff.x = snake.body[snake.body.length - 2].x - snake.body[snake.body.length - 1].x;
        tailDiff.y = snake.body[snake.body.length - 2].y - snake.body[snake.body.length - 1].y;
    }

    if (tailDiff.x == 20) {
        ctx.fillRect(snake.body[snake.body.length - 1].x + (cellSize * (subFrameSize * frame) - cellSize), snake.body[snake.body.length - 1].y, cellSize, cellSize);
        tailDiff.x = 0;
    } else if (tailDiff.x == -20) {
        ctx.fillRect(snake.body[snake.body.length - 1].x - (cellSize * (subFrameSize * frame) - cellSize), snake.body[snake.body.length - 1].y, cellSize, cellSize);
        tailDiff.x = 0;
    }
    if (tailDiff.y == 20) {
        ctx.fillRect(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y + (cellSize * (subFrameSize * frame) - cellSize), cellSize, cellSize);
        tailDiff.y = 0;
    } else if (tailDiff.y == -20) {
        ctx.fillRect(snake.body[snake.body.length - 1].x, snake.body[snake.body.length - 1].y - (cellSize * (subFrameSize * frame) - cellSize), cellSize, cellSize);
        tailDiff.y = 0;
    }
};

const update = () => {
    for (let i = 0; i < snake.body.length - 1; i++) {
        if (snake.body[i].x == snake.head.x && snake.body[i].y == snake.head.y) {
            window.location.reload();
        }
    }

    for (let i = 0; i < apples.length; i++) {
        if (snake.head.x == apples[i].x && snake.head.y == apples[i].y) {
            snake.body.push({ x: apples[i].x, y: apples[i].y });
            apples.splice(i, 1);
            addApple();
            score++;
            updateScore();
        }
    }

    for (let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i] = snake.body[i - 1];
    }
    if (snake.body.length) {
        snake.body[0] = { x: snake.head.x, y: snake.head.y };
    }

    if (snake.head.x == 0 && vel.x == -1) {
        snake.head.x = cellSize * gameSize.x - cellSize;
    } else if (snake.head.x == cellSize * gameSize.x - cellSize && vel.x == 1) {
        snake.head.x = 0;
    } else {
        snake.head.x += vel.x * cellSize;
    }

    if (snake.head.y == 0 && vel.y == -1) {
        snake.head.y += cellSize * gameSize.y - cellSize;
    } else if (snake.head.y == cellSize * gameSize.y - cellSize && vel.y == 1) {
        snake.head.y = 0;
    } else {
        snake.head.y += vel.y * cellSize;
    }

    vel2 = { x: vel.x, y: vel.y };
};

const call = () => {
    draw();
    frame++;
    if (frame == maxFrame) update();
};

const changeDirection = (k) => {
    if (snake.body.length) {
        headDiff.x = snake.head.x - snake.body[0].x;
        headDiff.y = snake.head.y - snake.body[0].y;
    }
    console.log(headDiff);
    if (k == "w" && vel.y != 1 && headDiff.y != 20) {
        vel = { x: 0, y: -1 };
    } else if (k == "s" && vel.y != -1 && headDiff.y != -20) {
        vel = { x: 0, y: 1 };
    } else if (k == "a" && vel.x != 1 && headDiff.x != 20) {
        vel = { x: -1, y: 0 };
    } else if (k == "d" && vel.x != -1 && headDiff.x != -20) {
        vel = { x: 1, y: 0 };
    }
};

for (let i = 0; i < 3; i++) {
    addApple();
}
document.addEventListener("keyup", (k) => changeDirection(k.key));
let callInterval = setInterval(call, 1000 / 60);
