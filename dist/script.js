"use strict";
const gameBoard = document.querySelector("#gameBoard");
const gameContext = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
];
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
gameStart();
// Sets up the initial score, creates the initial food, and starts the game loop with nextTick()
function gameStart() {
    running = true;
    scoreText.textContent = score.toString();
    createFood();
    drawFood();
    nextTick();
}
// Represents each frame of the game - Uses recursion to continuously call itself, so the function activates all other
// functions every 75 milliseconds, creating a game loop until the game is over.
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else {
        displayGameOver();
    }
}
// Clears the entire game board by filling it with the defined background color.
function clearBoard() {
    gameContext.fillStyle = boardBackground;
    gameContext.fillRect(0, 0, gameWidth, gameHeight);
}
// Generates random coordinates for the food within the game board boundaries.
// Ensures that the food is positioned at multiples of the unitSize for proper alignment with the snake.
function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}
// Draws the food on the game board using the defined food color and its current coordinates.
function drawFood() {
    gameContext.fillStyle = foodColor;
    gameContext.fillRect(foodX, foodY, unitSize, unitSize);
}
// Moves the snake by adding a new head segment in the direction of the current velocity.
// (The unshift() method is used to add one or more elements to the beginning of an array.)
// Checks if the snake has eaten the food, increments the score, updates the score display and creates a new food
// if necessary.If the snake did not eat, remove the last segment of the snake, simulating movement.
// (The pop() method is used to remove the last element from an array.)
function moveSnake() {
    const headOfSnake = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    snake.unshift(headOfSnake);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = score.toString();
        createFood();
    }
    else {
        snake.pop();
    }
}
// Draws each segment of the snake on the game board.
// Fills each segment with the snake color and outlines it with the snake border color.
function drawSnake() {
    gameContext.fillStyle = snakeColor;
    gameContext.strokeStyle = snakeBorder;
    snake.forEach((partOfSnake) => {
        gameContext.fillRect(partOfSnake.x, partOfSnake.y, unitSize, unitSize);
        gameContext.strokeRect(partOfSnake.x, partOfSnake.y, unitSize, unitSize);
    });
}
// Listens for keyboard input (arrow keys) and updates the snake's velocity accordingly.
// Ensures that the snake cannot reverse its direction instantly (e.g., cannot move from left to right without turning).
function changeDirection(event) {
    const keyPressed = event.key;
    const goingLeft = (xVelocity === -unitSize);
    const goingUp = (yVelocity === -unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingDown = (yVelocity === unitSize);
    switch (true) {
        case (keyPressed === 'ArrowLeft' && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === 'ArrowUp' && !goingDown):
            yVelocity = -unitSize;
            xVelocity = 0;
            break;
        case (keyPressed === 'ArrowRight' && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === 'ArrowDown' && !goingUp):
            yVelocity = unitSize;
            xVelocity = 0;
            break;
    }
}
// Checks if the game is over based on various conditions:
// If the snake collides with the game board boundaries.
// If the snake collides with itself (the head overlaps with any other body segment).
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}
// Displays the "GAME OVER!" message in the center of the game board when the game ends.
// Uses specified font, color, and alignment for the text.
function displayGameOver() {
    gameContext.font = "50px MV Boli";
    gameContext.fillStyle = "black";
    gameContext.textAlign = "center";
    gameContext.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}
// Resets the game state when the reset button is clicked.
// Sets the score back to 0, resets the snake's position and velocity, and starts a new game by calling gameStart().
function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
    ];
    gameStart();
}
