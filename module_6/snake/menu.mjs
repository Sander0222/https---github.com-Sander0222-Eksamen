"use strict";

/* Use this file to create the menu for the snake game. */

import libSprite from "../../common/libs/libSprite_v2.mjs";
import lib2D from "../../common/libs/lib2d_v2.mjs";
import {
  GameProps,
  SheetData,
  bateIsEaten,
  newGame,
  EGameStatus,
} from "./game.mjs";

import { TBoardCell, EBoardCellInfoType } from "./gameBoard.mjs";
export class TMenu { //Making the menu class for assigning the buttons and their functions
  #spPlay;
  #spGameOver;
  #spGameOverScore;
  #spHome;
  #spRetry;
  #spResume;
  #spScore;
  #spBaitScore;

  constructor(aSpriteCanvas) {
    this.spcvs = aSpriteCanvas;

    GameProps.gameStatus = EGameStatus.Idle;
    const pos = new lib2D.TPosition(210, 210);
    


    pos.y = 260;
    pos.x = 260;
    this.#spPlay = new libSprite.TSpriteButton(   // create play button
      aSpriteCanvas,   
      SheetData.Play,
      pos
    );
    this.#spPlay.animateSpeed = 30; // Set animation speed for built inn animation function
    this.#spPlay.onClick = this.#startGameClick.bind(this); // start the startGameClick function

    this.#spResume = new libSprite.TSpriteButton(
      aSpriteCanvas,                                  // create resume button
      SheetData.Resume, 
      pos
    );
    this.#spResume.animateSpeed = 30;  // Set animation speed for built inn animation function
    this.#spResume.onClick = this.toggleResume.bind(this);  // bind to toggleResume (spacebar)
    this.#spResume.visible = false; 
    
 pos.y = 100;
 pos.x = 10;
 this.#spScore = new libSprite.TSpriteNumber(  // create score text
    aSpriteCanvas,
    SheetData.Number,   
    new lib2D.TPosition(pos.x, pos.y)
 );
this.#spScore.alpha = 0.5; // Set transparency to 50% with the bulit inn alpha function
 const baitScorePos = new lib2D.TPosition(10, 10);
 this.#spBaitScore = new libSprite.TSpriteNumber(  // create bait score text
    aSpriteCanvas,
    SheetData.Number,   
    baitScorePos
 );
  this.#spBaitScore.alpha = 0.5; // Set transparency to 50% with the bulit inn alpha function
    const gameOverPos = new lib2D.TPosition(27, 50);
    this.#spGameOver = new libSprite.TSprite(   // create game over display
      aSpriteCanvas,
      SheetData.GameOver,
      gameOverPos
    );
  

   const homePos = new lib2D.TPosition(92, 399);
    this.#spHome = new libSprite.TSpriteButton(   // create home button
      aSpriteCanvas,
      SheetData.Home,
      homePos 
    );
    this.#spHome.onClick = this.#startIdleClick.bind(this); //start the startIdleClick function
    
    
    
const retryPos = new lib2D.TPosition(640, 399);
    this.#spRetry = new libSprite.TSpriteButton(   // create retry button
      aSpriteCanvas,
      SheetData.Retry,
      retryPos
    );
    
    this.#spRetry.onClick = this.#startGameClick.bind(this); // start the startGameClick function
    
   
    const gameOverScorePos = new lib2D.TPosition(520, 250);
    this.#spGameOverScore = new libSprite.TSpriteNumber(  // create game over score text
      aSpriteCanvas,
      SheetData.Number,   
      gameOverScorePos
   );
  
  }  


  draw() {
    // Hide all buttons by default
    this.#spPlay.visible = false;
    this.#spResume.visible = false;
    this.#spHome.visible = false;     // Made all buttons invisible by default to fix bug
    this.#spRetry.visible = false;

    switch (GameProps.gameStatus) {
      case EGameStatus.Idle: // whats on the screen when idle
        this.#spPlay.visible = true; // Makes buttons only visable when called for vv
        this.#spPlay.draw();
        break;
      case EGameStatus.Playing: // what is on the screen when playing
        this.#spScore.draw();
        this.#spBaitScore.draw();
        break;
      case EGameStatus.Pause: // what is on the screen when paused
        this.#spScore.draw();
        this.#spBaitScore.draw();
        this.#spResume.visible = true;
        this.#spResume.draw();
        break;
      case EGameStatus.GameOver: // what is on the screen when game over
        this.#spGameOver.draw();
        this.#spHome.visible = true;
        this.#spHome.draw();
        this.#spRetry.visible = true;
        this.#spRetry.draw();
        this.#spGameOverScore.draw();
        break;
    }
  } // end draw

  toggleResume() {
    if (GameProps.gameStatus === EGameStatus.Pause) {  // resumes game on button input in menu 
      GameProps.gameStatus = EGameStatus.Playing;
    } else if(GameProps.gameStatus === EGameStatus.Playing) {
      GameProps.gameStatus = EGameStatus.Pause;
    }
    this.#spResume.visible = GameProps.gameStatus === EGameStatus.Pause;
  }

  #startGameClick() { //Startgame to handle the start game status
    GameProps.gameStatus = EGameStatus.Playing;
   newGame(); // Start a new game
    this.#spPlay.visible = false;
    this.#spResume.visible = false;
    
  
 

  } // end startGame

  #startIdleClick() {   //Startidle to handle the idle game status 
    GameProps.gameStatus = EGameStatus.Idle;
    newGame(); // Start a new game
    this.#spPlay.visible = true;
    this.#spRetry.visible = false;
    this.#spHome.visible = false;
   
  } 

  updateScore(totalScore, countdown) {  //Handles the score and countdown values 
    this.#spScore.value = totalScore; // Update the total score text
    this.#spBaitScore.value = countdown; // Update the countdown score text
    this.#spGameOverScore.value = totalScore; // Update the game over score text with value from total score
  }
 
 
}
