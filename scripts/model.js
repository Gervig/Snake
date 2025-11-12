import Grid from "../data-structure/grid.js";
import Queue from "../data-structure/queue.js";

const scale = 0.5;

// sets game grid with hardcoded values
let rows = 10,
  cols = 10,
  cellSize;
if (window.innerWidth <= 480) {
  // mobile
  cols * scale;
  rows * scale;
  cellSize = "36px";
} else if (window.innerWidth <= 768) {
  // tablet
  cols * scale;
  rows * scale;
  cellSize = "32px";
} else {
  // desktop
  cols * scale;
  rows * scale;
  cellSize = "40px";
}

let gameRunning = false;
let collision = false;

export function isGameRunning() {
  return gameRunning;
}

export function setGameRunning(value) {
  gameRunning = value;
}

export function collisionDetected() {
  return collision;
}

export function setCollision(value) {
  collision = value;
}

// initalizes a player object at row, col
// rows/2 & cols/2 means the player will start in the middle
const player = {
  row: Math.floor(rows / 2),
  col: Math.floor(cols / 2),
};

const snake = new Queue();
snake.enqueue(player);

const goal = {
  row: 1,
  col: 1,
};

export function getPlayer() {
  return player;
}

export function getSnake() {
  return snake;
}

export function setSnake(newSnake) {
  snake = newSnake;
}

export function extendSnake(row, col) {
  snake.enqueue({ row, col });
}

export function moveSnake(nextHead, grow) {
  snake.enqueue(nextHead);
  if (!grow) snake.dequeue();
}

export function getGoal() {
  return goal;
}

export function getNumOfCols() {
  return cols;
}

export function getNumOfRows() {
  return rows;
}

export function setNewGoal() {}

// sets the variables in the style.css
const gridElement = document.getElementById("grid");

gridElement.style.setProperty("--rows", rows);
gridElement.style.setProperty("--cols", cols);
gridElement.style.setProperty("--cell-size", cellSize);

const totalCells = cols * rows;

function log(text) {
  console.log(text);
}

// --- GAME LOGIC --- //

// The game consists of a grid, where every cell has a value:
// 0 means the cell is empty
// 1 means its occupied by the 'snake' -> the player
// 2 means its occupied by the 'apple' -> the goal

let gameGrid = new Grid(rows, cols);

// array for holding col, row objects of free cells
let freeCells = [];

export function spawnGoal() {
  if (freeCells.length === 0) return; // can't spawn a new goal
  const { row, col } = freeCells[Math.floor(Math.random() * freeCells.length)]; // finds a random spot
  // sets new col and rows for goal
  goal.row = row;
  goal.col = col;
  writeToCell(row, col, 2); // writes new goal
}

export function writeToCell(row, col, value) {
  gameGrid.set({ row: row, col: col }, value);
}

export function readFromCell(row, col) {
  return gameGrid.get({ row: row, col: col });
}

export function getGrid() {
  return gameGrid;
}

export function clearGrid() {
  gameGrid.clear();
}

export function getFreeCells() {
  return freeCells;
}

export function setFreeCells(newCells) {
  freeCells = newCells;
}

export let state = {
  direction: "",
  nextDirection: "",
};
