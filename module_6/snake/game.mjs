"use strict";

//-----------------------------------------------------------------------------------------
//----------- Import modules, mjs files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import libSprite from "../../common/libs/libSprite_v2.mjs";
import { TGameBoard, GameBoardSize, TBoardCell } from "./gameBoard.mjs";
import { TSnake, EDirection } from "./snake.mjs";
import { TBait } from "./bait.mjs";
import { TMenu } from "./menu.mjs";

//-----------------------------------------------------------------------------------------
//----------- variables and object --------------------------------------------------------
//-----------------------------------------------------------------------------------------
const cvs = document.getElementById("cvs");
const spcvs = new libSprite.TSpriteCanvas(cvs);
let gameSpeed = 4; // Game speed multiplier;
let hndUpdateGame = null;
export const EGameStatus = { Idle: 0, Playing: 1, Pause: 2, GameOver: 3 };

// prettier-ignore
export const SheetData = {
  Head:     { x:   0, y:   0, width:  38, height:  38, count:  4 },
  Body:     { x:   0, y:  38, width:  38, height:  38, count:  6 },
  Tail:     { x:   0, y:  76, width:  38, height:  38, count:  4 },
  Bait:     { x:   0, y: 114, width:  38, height:  38, count:  1 },
  Play:     { x:   0, y: 155, width: 202, height: 202, count: 10 },
  GameOver: { x:   0, y: 647, width: 856, height: 580, count:  1 },
  Home:     { x:  65, y: 995, width: 169, height: 167, count:  1 },
  Retry:    { x: 614, y: 995, width: 169, height: 167, count:  1 },
  Resume:   { x:   0, y: 357, width: 202, height: 202, count: 10 },
  Number:   { x:   0, y: 560, width:  81, height:  86, count: 10 },
};

export const GameProps = {
  gameBoard: null,
  gameStatus: EGameStatus.Idle,
  snake: null,
  bait: null,
  score: 0, // Score of the game
  gameOverScore: 0, // Score when game is over
  countdown: 50, // Countdown score
  menu: null, // Menu object
};

//------------------------------------------------------------------------------------------
//----------- Exported functions -----------------------------------------------------------
//------------------------------------------------------------------------------------------

export function newGame() {
  GameProps.gameBoard = new TGameBoard();
  GameProps.snake = new TSnake(spcvs, new TBoardCell(5, 5)); // Initialize snake with a starting position
  GameProps.bait = new TBait(spcvs); // Initialize bait with a starting position
  gameSpeed = 4; // Reset game speed
  GameProps.score = 0; // Reset score
  GameProps.countdown = 50; // Reset countdown

  // This fixes the issue with the snake still using gameSpeed from the previous game and resets it.Help from copilot
  clearInterval(hndUpdateGame);
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed);
  console.log("Game loop restarted with gameSpeed:", gameSpeed);
}

export function bateIsEaten() {
  console.log("Bait eaten!");
  /* Logic to increase the snake size and score when bait is eaten */

  GameProps.score += GameProps.countdown; // Increase score with the countdown score
  GameProps.countdown = 50; // Reset countdown score
  if (GameProps.menu) {
    GameProps.menu.updateScore(GameProps.score, GameProps.countdown, GameProps.gameOverScore); // Update score on the menu
  }
  GameProps.snake.grow(); // Increase snake size
  GameProps.bait.update(); // Update bait position
  increaseGameSpeed(); // Increase game speed
}

//------------------------------------------------------------------------------------------
//----------- functions -------------------------------------------------------------------
//------------------------------------------------------------------------------------------

function loadGame() {
  cvs.width = GameBoardSize.Cols * SheetData.Head.width;
  cvs.height = GameBoardSize.Rows * SheetData.Head.height;

  GameProps.gameStatus = EGameStatus.Idle; // change game status to Idle on start of program

  /* Create the game menu here */
  GameProps.menu = new TMenu(spcvs); // Create the menu object


  requestAnimationFrame(drawGame);
  console.log("Game canvas is rendering!");
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); // Update game every 1000ms / gameSpeed
  console.log("Game canvas is updating!");
}

function drawGame() {
  // Clear the canvas
  spcvs.clearCanvas();

  switch (
    GameProps.gameStatus // set up the game status and menu
  ) {
    case EGameStatus.Idle: // whats on screen when game is idle
    GameProps.menu.draw();  
    break;
    case EGameStatus.Playing: // what is on screen when game is playing
       GameProps.bait.draw();
      GameProps.snake.draw();
      GameProps.menu.draw();
      break;
    case EGameStatus.Pause: // what is on screen when game is paused
      GameProps.bait.draw();
      GameProps.snake.draw();
      GameProps.menu.draw();
      break;
    case EGameStatus.GameOver:    // what is on screen when game is over
    GameProps.snake.draw();
    GameProps.bait.draw();  
    GameProps.menu.draw();
      break;
  }
  
  // Request the next frame
  requestAnimationFrame(drawGame);
}

function updateGame() {
  // Update game logic here
  switch (GameProps.gameStatus) {
    case EGameStatus.Playing:
      if (!GameProps.snake.update()) {
        GameProps.gameStatus = EGameStatus.GameOver;
        console.log("Game over!");
      }
      if (GameProps.countdown > 0) { // Countdown logic, Made countdown speed the same as game tickspeed for added intensity
        // Starts countdown from 50
        GameProps.countdown -= 1;
      }
      if (GameProps.menu) {
        GameProps.menu.updateScore(GameProps.score, GameProps.countdown, GameProps.gameOverScore); // Update score on the menu
      }
      break;
  }
}

function increaseGameSpeed() {
  /* Increase game speed logic here */
  gameSpeed += 0.4; // help from copilot
  clearInterval(hndUpdateGame);
  hndUpdateGame = setInterval(updateGame, 1000 / gameSpeed); // Update game every 1000ms / gameSpeed
  console.log("Game speed increased to: " + gameSpeed);
  console.log("Increase game speed!");
}

//-----------------------------------------------------------------------------------------
//----------- Event handlers --------------------------------------------------------------
//-----------------------------------------------------------------------------------------



function onKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      GameProps.snake.setDirection(EDirection.Up);
      break;
    case "ArrowDown":
      GameProps.snake.setDirection(EDirection.Down);
      break;
    case "ArrowLeft":
      GameProps.snake.setDirection(EDirection.Left);
      break;
    case "ArrowRight":
      GameProps.snake.setDirection(EDirection.Right);
      break;
    case " ":
      console.log("Space key pressed!");
      /* Pause the game logic here */
      GameProps.menu.toggleResume();

      break;
    default:
      console.log(`Key pressed: "${event.key}"`);
  }
}
//-----------------------------------------------------------------------------------------
//----------- main -----------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

spcvs.loadSpriteSheet("./Media/spriteSheet.png", loadGame);
document.addEventListener("keydown", onKeyDown);
