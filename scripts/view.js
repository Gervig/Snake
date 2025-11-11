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

  switch (button.id) {
    case "up":
      //TODO: if you click faster than the framerate you can do a 180 by...
      // for example, given up, then left, then down before game's next tick
      // results in a 180
      if (model.state.direction === "down") break; // can't do a 180
      model.state.direction = "up";
      break;
    case "left":
      if (model.state.direction === "right") break;
      model.state.direction = "left";
      break;
    case "right":
      if (model.state.direction === "left") break;
      model.state.direction = "right";
      break;
    case "down":
      if (model.state.direction === "up") break;
      model.state.direction = "down";
      break;
  }
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
  rows = model.getNumofRows();
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
          cells[index].classList.remove("player", "goal");
          freeCells.push({ row, col }); // track free cell
          break;
        case 1: // snake
          cells[index].classList.add("player");
          cells[index].classList.remove("goal");
          break;
        case 2: // goal
          cells[index].classList.add("goal");
          cells[index].classList.remove("player");
          break;
      }
    }
  }

  // store free cells it back in your model for reuse
  model.setFreeCells(freeCells);
}
