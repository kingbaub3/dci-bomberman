import * as fromState from "../state";
import * as fromServer from 'dci-game-server';
import { Unsubscribe } from "redux";
const gameloop = require('node-gameloop');

/**
 * This class manages the game loop as well as to restart and pause the game.
 */
export class GameManager {
    private readonly FPS = 60;
    private _isGameRunning = false;
    private _gameLoopId: number = null;
    private _currentGameState: fromState.GameState;
    private _gameStateManager: fromServer.GameState<fromState.GameState>;
    private _unsubscribeFromStore: Unsubscribe;

    constructor() {
        // Initializes the store
        this._gameStateManager = new fromServer.GameState<fromState.GameState>(fromState.gameStateReducer);
        // And retrieves the state whenever it changes.
        this._unsubscribeFromStore = this._gameStateManager.subscribe(() => {
            this._currentGameState = this._gameStateManager.getState();
            console.log(this._currentGameState);
        });

        this._currentGameState = this._gameStateManager.getState();
    }

    cleanUpResources(): void {
        this._unsubscribeFromStore();
    }


    /**
     * This function starts the game loop. In order for it to run properly,
     * there must be the proper number of players, which is between 2 and 4
     * for the bomberman game.
     */
    startGame(): void {
        this._isGameRunning = true;

        this._gameLoopId = gameloop.setGameLoop( () => this.gameIteration(), 1000/this.FPS);
    }

    /**
     * Stops and quits the game loop.
     */
    stopGame(): void {
        if(this._isGameRunning) {
            gameloop.clearGameLoop(this._gameLoopId);
            this._gameLoopId = null;
            this._isGameRunning = false;
        }
        else {
            console.error("Cannot stop the game since none is running currently.");
        }
    }

    /**
     * Pauses the game loop and notifies the players
     */
    pauseGame(): void {
        if(!this._currentGameState.paused) {
            this._gameStateManager.dispatch(fromState.PauseGame.create());
        }
    }

    /**
     * Resumes the game loop and notifies the players
     */
    resumeGame(): void {
        if(this._currentGameState.paused) {
            this._gameStateManager.dispatch(fromState.ResumeGame.create());
        }
    }

    /**
     * This function is called at each game loop iteration 
     */
    private gameIteration() {
        if(this._currentGameState.paused) {
            // Do nothing since the game is paused.
            return;
        }


    }
}