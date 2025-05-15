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
export class TMenu {
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
    this.#spPlay.animateSpeed = 30;
    this.#spPlay.onClick = this.#startGameClick.bind(this);

    this.#spResume = new libSprite.TSpriteButton(
      aSpriteCanvas,                                  // create resume button
      SheetData.Resume, 
      pos
    );
    this.#spResume.animateSpeed = 30;
    this.#spResume.onClick = this.toggleResume.bind(this);  // bind to toggleResume (spacebar)
    this.#spResume.visible = false; 
    
 pos.y = 100;
 pos.x = 10;
 this.#spScore = new libSprite.TSpriteNumber(  // create score text
    aSpriteCanvas,
    SheetData.Number,   
    new lib2D.TPosition(pos.x, pos.y)
 );
this.#spScore.alpha = 0.5; // Set transparency to 50%
 const baitScorePos = new lib2D.TPosition(10, 10);
 this.#spBaitScore = new libSprite.TSpriteNumber(  // create bait score text
    aSpriteCanvas,
    SheetData.Number,   
    baitScorePos
 );
  this.#spBaitScore.alpha = 0.5; // Set transparency to 50%
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
    this.#spHome.onClick = this.#startIdleClick.bind(this);
    
    
    
const retryPos = new lib2D.TPosition(640, 399);
    this.#spRetry = new libSprite.TSpriteButton(   // create retry button
      aSpriteCanvas,
      SheetData.Retry,
      retryPos
    );
    
    this.#spRetry.onClick = this.#startGameClick.bind(this);
    
   
    const gameOverScorePos = new lib2D.TPosition(530, 250);
    this.#spGameOverScore = new libSprite.TSpriteNumber(  // create game over score text
      aSpriteCanvas,
      SheetData.Number,   
      gameOverScorePos
   );
  
  }  


  draw() {
    switch (GameProps.gameStatus) {
      case EGameStatus.Idle: // whats on screen when game idle O__O
        this.#spPlay.draw();
        break;
        case EGameStatus.Playing: // what is on screen when game is playing
        this.#spScore.draw();
        this.#spBaitScore.draw();
        break;
      case EGameStatus.Pause: // what is on screen when game is paused
      // fix for numbers not showing when game is paused
      this.#spScore.draw();
      this.#spBaitScore.draw();
      break;
        case EGameStatus.GameOver: // what is on screen when game over
        this.#spGameOver.draw();
        this.#spHome.draw();
        this.#spRetry.draw();
        this.#spGameOverScore.draw();
        break;
    }

    this.#spResume.draw();
    
  } // end draw

  toggleResume() {
    if (GameProps.gameStatus === EGameStatus.Pause) {  // resumes game on button input in menu 
      GameProps.gameStatus = EGameStatus.Playing;
    } else if(GameProps.gameStatus === EGameStatus.Playing) {
      GameProps.gameStatus = EGameStatus.Pause;
    }
    this.#spResume.visible = GameProps.gameStatus === EGameStatus.Pause;
  }

  #startGameClick() {
    GameProps.gameStatus = EGameStatus.Playing;
   newGame(); // Start a new game
    this.#spPlay.visible = false;
    this.#spResume.visible = false;
  
 

  } // end startGame

  #startIdleClick() {
    GameProps.gameStatus = EGameStatus.Idle;
    newGame(); // Start a new game
    this.#spPlay.visible = true;
   
  } 

  updateScore(totalScore, countdown) {
    this.#spScore.value = totalScore; // Update the total score text
    this.#spBaitScore.value = countdown; // Update the countdown score text
    this.#spGameOverScore.value = totalScore; // Update the game over score text with value from total score
  }
 /*showGameOver() {
    this.#spGameOver.visible = true;
    this.#spHome.visible = true;
    this.#spRetry.visible = true;
  } //  showGameOver */
 
}
