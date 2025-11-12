import * as controller from "./controller.js";
import * as model from "./model.js";

export function registerEventHandlers() {
  log(`Register event handlers`);

  // html buttons for moving on mobile
  document.querySelector("#buttons").addEventListener("click", clickedButton);
}

// button logic
function clickedButton(event) {
  const button = event.target;
  const dir = model.state.direction;
  const next = model.state.nextDirection;

  switch (button.id) {
    case "up":
      if (dir !== "down" && next !== "down") model.state.nextDirection = "up";
      break;
    case "left":
      if (dir !== "right" && next !== "right")
        model.state.nextDirection = "left";
      break;
    case "right":
      if (dir !== "left" && next !== "left")
        model.state.nextDirection = "right";
      break;
    case "down":
      if (dir !== "up" && next !== "up") model.state.nextDirection = "down";
      break;
  }

  if (!model.isGameRunning()) model.setGameRunning(true);
}

function log(text) {
  console.log(text);
}

// sets game grid variables
let cells;
let rows;
let cols;

// gets the goal from the model
let goal = model.getGoal();

export function initView() {
  const gridElement = document.getElementById("grid");
  cells = gridElement.querySelectorAll(".cell");
  rows = model.getNumOfRows();
  cols = model.getNumOfCols();
  // draws the first goal
  model.writeToCell(goal.row, goal.col, 2);
}

export function displayGrid() {
  let freeCells = []; // rebuild free cells each frame

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const cellValue = model.readFromCell(row, col);

      switch (cellValue) {
        case 0: // empty
          cells[index].classList.remove("player", "goal", "collision");
          freeCells.push({ row, col }); // track free cell
          break;
        case 1: // snake
          cells[index].classList.add("player");
          cells[index].classList.remove("goal", "collision");
          break;
        case 2: // goal
          cells[index].classList.add("goal");
          cells[index].classList.remove("player", "collision");
          break;
        case 3: // collision
          cells[index].classList.remove("player", "goal");
          cells[index].classList.add("collision");
      }
    }
  }

  // store free cells back in your model for reuse
  model.setFreeCells(freeCells);
}
