/** @format */

import { randomElementFromArray, wait } from "./utils.js";

const foodItemsArray = [
	"🐁",
	"🍇",
	"🍉",
	"🍈",
	"🍓",
	"🍍",
	"🍌",
	"🥝",
	"🍏",
	"🍎",
	"🍔",
	"🍅",
	"🥚",
];

// display variable
const startBtn = document.querySelector(".start-btn");
const scoreDisplay = document.querySelector(".score");
const grid = document.querySelector(".grid");
const keyBtn = document.querySelectorAll(".keys-container button");
let foodItemIndex = 0;
let score = 0;

// grid variables
const width = 10;
const numCells = width * width;
const cellSize = 20;
grid.style.width = `${width * cellSize}px`;
grid.style.height = `${width * cellSize}px`;

// create grid cells
for (let i = 0; i < numCells; i++) {
	const cell = document.createElement("div");
	cell.style.width = `${cellSize}px`;
	cell.style.height = `${cellSize}px`;
	grid.appendChild(cell);
}

const cells = document.querySelectorAll(".grid div");

// snake
let currSnake = [2, 1, 0];
let snakeColor = Math.floor(Math.random() * 360);
let colorIncrement = 10;

// moving snake
let direction = 1;
let intervalTime = 200;
let interval = 0;

// start game
function startGame() {
	grid.classList.remove("shake");
	currSnake.forEach((i) => {
		cells[i].style.background = "none";
		cells[i].classList.remove("snake");
		cells[i].innerText = "";
	});
	clearInterval(interval);
	direction = 1;

	currSnake = [2, 1, 0];
	currSnake.forEach((i) => {
		snakeColor = (snakeColor + colorIncrement) % 360;
		cells[i].style.background = `hsl(${snakeColor}, 100%, 50%)`;
		cells[i].classList.add("snake");
	});
	cells[currSnake[0]].innerText = "👀";

	cells[foodItemIndex].classList.remove("food-item");
	cells[foodItemIndex].innerText = "";
	createFood();
	score = 0;
	scoreDisplay.innerHTML = score;
	interval = setInterval(gameLoop, intervalTime);
}

function gameLoop() {
	if (
		(direction === width && currSnake[0] + direction >= numCells) ||
		(direction === -width && currSnake[0] + direction < 0) ||
		(direction === 1 && currSnake[0] % width === width - 1) ||
		(direction === -1 && currSnake[0] % width === 0) ||
		cells[currSnake[0] + direction].classList.contains("snake")
	) {
		grid.classList.add("shake");
		clearInterval(interval);
		return;
	}

	cells[currSnake[0]].innerText = "";
	const tail = currSnake.pop();
	cells[tail].style.background = "none";
	cells[tail].classList.remove("snake");
	currSnake.unshift(currSnake[0] + direction);

	snakeColor = (snakeColor + colorIncrement) % 360;
	cells[currSnake[0]].style.background = `hsl(${snakeColor}, 100%, 50%)`;
	cells[currSnake[0]].classList.add("snake");
	cells[currSnake[0]].innerText = "👀";

	if (cells[currSnake[0]].classList.contains("food-item")) {
		cells[currSnake[0]].classList.remove("food-item");
		snakeColor = (snakeColor + colorIncrement) % 360;
		cells[tail].style.background = `hsl(${snakeColor}, 100%, 50%)`;
		cells[tail].classList.add("snake");
		currSnake.push(tail);
		score++;
		scoreDisplay.innerHTML = score;
		createFood();
	}
}

function moveSnake(moveDirection) {
	let directionVal;
	if (moveDirection === "ArrowRight" && direction !== -1) {
		directionVal = 1;
		if (currSnake[0] + directionVal === currSnake[1]) return;
		direction = directionVal;
	} else if (moveDirection === "ArrowLeft" && direction !== 1) {
		directionVal = -1;
		if (currSnake[0] + directionVal === currSnake[1]) return;
		direction = directionVal;
	} else if (moveDirection === "ArrowDown" && direction !== -width) {
		directionVal = width;
		if (currSnake[0] + directionVal === currSnake[1]) return;
		direction = directionVal;
	} else if (moveDirection === "ArrowUp" && direction !== width) {
		directionVal = -width;
		if (currSnake[0] + directionVal === currSnake[1]) return;
		direction = directionVal;
	}
}

function handleKeyBtn(event) {
	if (
		["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)
	) {
		moveSnake(event.key);
	}
	return;
}
document.addEventListener("keydown", handleKeyBtn);

function handleButtonKey(event) {
	const { id } = event.currentTarget;
	moveSnake(id);
}

keyBtn.forEach((btn) => {
	btn.addEventListener("mousedown", handleButtonKey);
	btn.addEventListener("touchstart", handleButtonKey);
});

async function createFood() {
	foodItemIndex = Math.floor(Math.random() * numCells);
	if (currSnake.includes(foodItemIndex)) {
		await wait(100);
		createFood();
	} else {
		cells[foodItemIndex].classList.add("food-item");
		cells[foodItemIndex].textContent =
			randomElementFromArray(foodItemsArray);
	}
}

startBtn.addEventListener("click", startGame);
