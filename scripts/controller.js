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

  let numOfRows = model.getNumofRows();
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
let player = model.getPlayer();
// sets the player to the window
window.player = player;
// sets the direction to the window
window.direction = model.state.direction;

startController();

function log(text) {
  console.log(text);
}

function tick() {
  // setup next game tick
  setTimeout(tick, 500);

  // remove player from the model
  model.writeToCell(player.row, player.col, 0);

  switch (model.state.direction) {
    case "left":
      // move the player to the left
      player.col--;
      if (player.col < 0) player.col = 9;
      break;
    case "right":
      // move the player to the right
      player.col++;
      if (player.col > 9) player.col = 0;
      break;
    case "up":
      // move the player up
      player.row--;
      if (player.row < 0) player.row = 9;
      break;
    case "down":
      // move the player down
      player.row++;
      if (player.row > 9) player.row = 0;
      break;
  }

  // re-add player to the model
  model.writeToCell(player.row, player.col, 1);

  // update the display of the entire model
  view.displayGrid();
}

function keyPress(event) {
  // log(event);

  switch (event.key) {
    case "ArrowLeft":
    case "a":
      model.state.direction = "left";
      break;
    case "ArrowRight":
    case "d":
      model.state.direction = "right";
      break;
    case "ArrowUp":
    case "w":
      model.state.direction = "up";
      break;
    case "ArrowDown":
    case "s":
      model.state.direction = "down";
      break;
  }
}
