const gameSize = { x: 25, y: 25 };
const cellSize = 20;
let vel = { x: 1, y: 0 };

let gw = document.querySelector(".game-window");
gw.width = gameSize.y * cellSize;
gw.height = gameSize.x * cellSize;
let ctx = gw.getContext("2d");

let snake = { head: { x: cellSize * 10, y: cellSize * 10 }, body: [] };
let apples = new Array();
let score = 0;
let speed = 1;

const addApple = (opt = false, x2, y2) => {
    let x = Math.floor(Math.random() * gameSize.x) * cellSize;
    let y = Math.floor(Math.random() * gameSize.y) * cellSize;
    while (snake.head.x == x && snake.head.y == y) {
        x = Math.floor(Math.random() * gameSize.x) * cellSize;
        y = Math.floor(Math.random() * gameSize.y) * cellSize;
    }
    if (opt) apples.push({ x: x2, y: y2 });
    else apples.push({ x: x, y: y });
};

for (i = 0; i < 3; i++) {
    addApple();
}

const draw = () => {
    ctx.clearRect(0, 0, gw.width, gw.height);
    ctx.fillStyle = "red";
    apples.forEach((a) => {
        ctx.fillRect(a.x, a.y, cellSize, cellSize);
    });

    ctx.fillStyle = "lime";
    ctx.fillRect(snake.head.x, snake.head.y, cellSize, cellSize);
    for (let i = 0; i < snake.body.length; i++) {
        ctx.fillRect(snake.body[i].x, snake.body[i].y, cellSize, cellSize);
    }
};

const gameloop = () => {
    // debugger;
    for (let i = 0; i < apples.length; i++) {
        if (snake.head.x == apples[i].x && snake.head.y == apples[i].y) {
            snake.body.push({ x: apples[i].x, y: apples[i].y });
            apples.splice(i, 1);
            addApple();
            score++;
            // speed += Math.sqrt(score) / 10;
            // clearInterval(game);
            // game = setInterval(gameloop, 1000 / speed);
            // console.log(score, speed);
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

    for (let i = 0; i < snake.body.length - 1; i++) {
        if (snake.body[i].x == snake.head.x && snake.body[i].y == snake.head.y) {
            snake = { head: { x: cellSize * 10, y: cellSize * 10 }, body: [] };
        }
    }
};

document.addEventListener("keyup", (k) => changeDirection(k.key));
let game = setInterval(gameloop, 1000 / 10);
setInterval(draw, 1000 / 60);

const changeDirection = (k) => {
    if (k == "w" && vel.y != 1) {
        vel = { x: 0, y: -1 };
    } else if (k == "s" && vel.y != -1) {
        vel = { x: 0, y: 1 };
    } else if (k == "a" && vel.x != 1) {
        vel = { x: -1, y: 0 };
    } else if (k == "d" && vel.x != -1) {
        vel = { x: 1, y: 0 };
    }
};
