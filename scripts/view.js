import * as controller from "./controller.js";
import * as model from "./model.js";

export function registerEventHandlers() {
  log(`Register event handlers`);

  //TODO: handle button clicks
  document.querySelector("#buttons").addEventListener("click", clickedButton);
}

function clickedButton(event) {
  const button = event.target;

  switch (button.id) {
    case "up":
      model.state.direction = "up";
      break;
    case "left":
      model.state.direction = "left";
      break;
    case "right":
      model.state.direction = "right";
      break;
    case "down":
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

export function initView() {
  const gridElement = document.getElementById("grid");
  cells = gridElement.querySelectorAll(".cell");
  rows = model.getNumofRows();
  cols = model.getNumOfCols();
}

export function displayGrid() {
  for (let row = 0; row < rows; row++) {
    // scans through the model
    for (let col = 0; col < cols; col++) {
      // calculates 2D array to 1D array
      const index = row * cols + col;

      // sets class based on game logic
      switch (model.readFromCell(row, col)) {
        case 0:
          cells[index].classList.remove("player", "goal");
          break;
        case 1:
          cells[index].classList.add("player");
          break;
        case 2:
          cells[index].classList.add("goal");
          break;
      }
    }
  }
}
