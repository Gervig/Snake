"use strict";
import * as view from "./view.js";
import * as model from "./model.js";

// events: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events
// keyboard: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
// keys: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values

function startController() {
  // calls view.register
  view.registerEventHandlers();

  // register key-presses
  document.addEventListener("keydown", keyPress);

  let numOfRows = model.getNumOfRows();
  let numOfCol = model.getNumOfCols();

  // gets access to other modules
  // when controller is started
  window.model = model;
  window.view = view;

  const grid = document.getElementById("grid");

  log(`Rows: ${numOfRows}, Col: ${numOfCol}`);

  for (let row = 0; row < numOfRows; row++) {
    for (let col = 0; col < numOfCol; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.textContent = "";
      grid.appendChild(cell);
    }
  }

  // initialize the view after the DOM cells
  view.initView();

  // model.startGame();
  tick();
}

// gets the player object from the model
let next = model.getPlayer();
// sets the player to the window
window.player = next;
// sets the direction to the window
window.direction = model.state.direction;

// gets the goal object from the model
let goal = model.getGoal();
// sets the goal to the window
window.goal = goal;

startController();

function log(text) {
  console.log(text);
}

function tick() {
  // setup next game tick
  setTimeout(tick, 200);

  // commit the next direction to the direction
  // prevents 180 movement when clicking faster than the game tick
  model.state.direction = model.state.nextDirection;

  // sets model variables
  const snake = model.getSnake();
  // the head of the snake is actually the tail of the list inside of it
  const head = snake.tail().data;
  const next = { row: head.row, col: head.col };
  const rows = model.getNumOfRows();
  const cols = model.getNumOfRows();

  // remove player from the model
  model.writeToCell(next.row, next.col, 0);

  switch (model.state.direction) {
    case "left":
      next.col--;
      if (next.col < 0) next.col = cols - 1;
      break;
    case "right":
      next.col++;
      if (next.col >= cols) next.col = 0;
      break;
    case "up":
      next.row--;
      if (next.row < 0) next.row = rows - 1;
      break;
    case "down":
      next.row++;
      if (next.row >= rows) next.row = 0;
      break;
  }

  // check for goal
  const goal = model.getGoal();
  let grow = false;
  if (next.col === goal.col && next.row === goal.row) {
    log(`Got the goal at row: ${goal.row}, col: ${goal.col}`);
    // sets goal to random new free cell
    model.spawnGoal();
    grow = true;
  }

// collision check
let node = snake.list.head; // start at head (tail of the queue)
while (node && model.isGameRunning()) {
  if (node.data.row === next.row && node.data.col === next.col) {
    // stop the game
    model.state.gameRunning = false;

    // draw snake up to the previous node
    let prevNode = node.prev;
    while (prevNode) {
      const { row, col } = prevNode.data;
      model.writeToCell(row, col, 1); // draw normal snake segment
      prevNode = prevNode.next; // iterate forward from head to collision
    }

    // draw the collision cell as red
    model.writeToCell(next.row, next.col, 3);

    // show final frame
    view.displayGrid();
    return; // stop tick
  }
  node = node.next;
}

  // move the snake
  snake.enqueue(next); // add new head
  if (!grow) snake.dequeue(); // remove tail unless the snake just ate a goal

  // clear grid before redrawing
  model.clearGrid();
  // loop through the snake
  for (let node = snake.head(); node; node = node.next) {
    // get the row and col of a node on the snake
    const { row, col } = node.data;
    // updates the grid with new snake value (1)
    model.writeToCell(row, col, 1);
  }
  // updates grid with new goal value
  const newGoal = model.getGoal();
  model.writeToCell(newGoal.row, newGoal.col, 2);

  // update the display of the entire model
  view.displayGrid();

  //TODO: implement collision!
  const freeCells = model.getFreeCells();

  if (model.isGameRunning()) {
    // const isCollision = !freeCells.some(
    //   (cell) => cell.row === next.row && cell.col === next.col
    // );
    // for (let i = 0; i < freeCells.length; i++) {
    //   if (freeCells[i].row === next.row && freeCells[i].col == next.col) {
    //     log(`Collision at ${freeCells[i]}`);
    //   }
    // }
    // if (isCollision) {
    //   log(`There was a collision!`);
    // }
  }
}

function keyPress(event) {
  const dir = model.state.direction;
  const next = model.state.nextDirection;

  switch (event.key) {
    case "ArrowLeft":
    case "a":
      if (dir !== "right" && next !== "right")
        model.state.nextDirection = "left";
      break;
    case "ArrowRight":
    case "d":
      if (dir !== "left" && next !== "left")
        model.state.nextDirection = "right";
      break;
    case "ArrowUp":
    case "w":
      if (dir !== "down" && next !== "down") model.state.nextDirection = "up";
      break;
    case "ArrowDown":
    case "s":
      if (dir !== "up" && next !== "up") model.state.nextDirection = "down";
      break;
  }
  if (!model.isGameRunning()) model.setGameRunning(true);
}
