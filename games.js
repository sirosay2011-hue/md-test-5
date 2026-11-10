
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

// ===============================
// КАРТИНКИ
// ===============================

const background = new Image();
background.src = "background.jpg";

const cynSheet = new Image();
cynSheet.src = "cyn-centipede.png";

// ЧЕТЫРЕ НАПРАВЛЕНИЯ ГОЛОВЫ CYN
const cynHeads = new Image();
cynHeads.src = "cyn-head-directions.png";

// UZI ВМЕСТО ЕДЫ
const uziFood = new Image();
uziFood.src = "uzi-food.png";

// ===============================
// ПЕРЕМЕННЫЕ
// ===============================

let snake;
let food;
let direction;
let nextDirection;
let score;
let game;
let running = false;
let speed = 180;

// ===============================
// КООРДИНАТЫ ГОЛОВЫ
// ===============================

const heads = {
    UP:    [225, 0, 477, 450],
    DOWN:  [861, 0, 451, 482],
    LEFT:  [238, 513, 474, 463],
    RIGHT: [847, 513, 466, 480]
};

// ===============================
// ПЕРЕЗАПУСК
// ===============================

function restartGame() {

    clearInterval(game);

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 },
        { x: 140, y: 200 },
        { x: 120, y: 200 }
    ];

    direction = "RIGHT";
    nextDirection = "RIGHT";
    score = 0;
    running = false;

    document.getElementById("score").textContent = score;

    document.getElementById("message").textContent =
        "Нажми SPACE чтобы начать";

    createFood();
    draw();
}

// ===============================
// СОЗДАНИЕ ЕДЫ
// ===============================

function createFood() {

    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box
    };

    if (snake.some(p => p.x === food.x && p.y === food.y)) {
        createFood();
    }
}

// ===============================
// ОТРИСОВКА CYN
// ===============================

function drawCyn() {

    if (!cynSheet.complete || !cynSheet.naturalWidth) return;

    ctx.imageSmoothingEnabled = false;

    snake.forEach((part, index) => {

        ctx.save();

        ctx.translate(
            part.x + box / 2,
            part.y + box / 2
        );

        ctx.shadowColor = "#EAFF00";
        ctx.shadowBlur = index === 0 ? 18 : 10;

        if (index === 0) {

            // ГОЛОВА CYN
            // Выбираем отдельное изображение
            // в зависимости от направления

            if (cynHeads.complete && cynHeads.naturalWidth) {

                const [sx, sy, sw, sh] =
                    heads[direction] || heads.RIGHT;

                ctx.drawImage(
                    cynHeads,
                    sx, sy, sw, sh,
                    -20, -20,
                    40, 40
                );
            }

        } else {

            // ТЕЛО И ХВОСТ

            const previous = snake[index - 1];

            const angle = Math.atan2(
                previous.y - part.y,
                previous.x - part.x
            );

            ctx.rotate(angle);

            let sx, sy, sw, sh;

            if (index === snake.length - 1) {

                // ХВОСТ

                sx = 1835;
                sy = 270;
                sw = 210;
                sh = 235;

            } else {

                // ТЕЛО

                sx = 475;
                sy = 270;
                sw = 190;
                sh = 235;
            }

            ctx.drawImage(
                cynSheet,
                sx, sy, sw, sh,
                -box / 2,
                -box / 2,
                box,
                box
            );
        }

        ctx.restore();
    });
}

// ===============================
// ОТРИСОВКА UZI
// ===============================

function drawUzi() {

    if (!uziFood.complete || !uziFood.naturalWidth) return;

    ctx.save();

    ctx.imageSmoothingEnabled = false;

    ctx.shadowColor = "#A020F0";
    ctx.shadowBlur = 18;

    // Размер Uzi
    const size = 50;

    ctx.drawImage(
        uziFood,
        food.x + box / 2 - size / 2,
        food.y + box / 2 - size / 2,
        size,
        size
    );

    ctx.restore();
}

// ===============================
// ОТРИСОВКА ИГРЫ
// ===============================

function draw() {

    ctx.globalAlpha = 1;

    ctx.drawImage(
        background,
        0, 0,
        400, 400
    );

    // СЕТКА

    ctx.strokeStyle = "#15232a";

    for (let i = 0; i < 400; i += box) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 400);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(400, i);
        ctx.stroke();
    }

    // CYN

    drawCyn();

    // UZI ВМЕСТО ЕДЫ

    drawUzi();
}

// ===============================
// НАЧАЛО ИГРЫ
// ===============================

function startGame() {

    if (running) return;

    running = true;

    document.getElementById("message").textContent =
        "Игра началась!";

    game = setInterval(update, speed);
}

// ===============================
// ДВИЖЕНИЕ
// ===============================

function update() {

    direction = nextDirection;

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    let ateFood =
        head.x === food.x && head.y === food.y;

    let body = ateFood ? snake : snake.slice(0, -1);

    // СТОЛКНОВЕНИЕ

    if (
        head.x < 0 ||
        head.x >= 400 ||
        head.y < 0 ||
        head.y >= 400 ||
        body.some(p => p.x === head.x && p.y === head.y)
    ) {

        endGame();
        return;
    }

    snake.unshift(head);

    if (ateFood) {

        score += 10;

        document.getElementById("score").textContent = score;

        createFood();

    } else {

        snake.pop();
    }

    draw();
}

// ===============================
// КОНЕЦ ИГРЫ
// ===============================

function endGame() {

    clearInterval(game);

    running = false;

    document.getElementById("message").textContent =
        "GAME OVER! Нажми RESTART";
}

// ===============================
// УПРАВЛЕНИЕ
// ===============================

document.addEventListener("keydown", function(event) {

    const keys = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT"
    };

    if (event.code === "Space") {

        event.preventDefault();
        startGame();
        return;
    }

    const newDirection = keys[event.key];

    if (!newDirection) return;

    event.preventDefault();

    if (newDirection === "UP" && direction !== "DOWN")
        nextDirection = "UP";

    if (newDirection === "DOWN" && direction !== "UP")
        nextDirection = "DOWN";

    if (newDirection === "LEFT" && direction !== "RIGHT")
        nextDirection = "LEFT";

    if (newDirection === "RIGHT" && direction !== "LEFT")
        nextDirection = "RIGHT";
});

// ===============================
// СКОРОСТЬ
// ===============================

const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

speedInput.addEventListener("input", () => {

    speed = Number(speedInput.value);

    speedValue.textContent = speed;

    if (running) {

        clearInterval(game);

        game = setInterval(update, speed);
    }
});

// ===============================
// ЗАГРУЗКА КАРТИНОК
// ===============================

background.onload = () => draw();
cynSheet.onload = () => draw();
cynHeads.onload = () => draw();
uziFood.onload = () => draw();

// ===============================
// МОБИЛЬНОЕ УПРАВЛЕНИЕ
// ===============================

function mobileMove(newDirection) {

    if (!running) {
        startGame();
    }

    if (newDirection === "UP" && direction !== "DOWN")
        nextDirection = "UP";

    if (newDirection === "DOWN" && direction !== "UP")
        nextDirection = "DOWN";

    if (newDirection === "LEFT" && direction !== "RIGHT")
        nextDirection = "LEFT";

    if (newDirection === "RIGHT" && direction !== "LEFT")
        nextDirection = "RIGHT";
}
// ЗАПУСК
restartGame();
