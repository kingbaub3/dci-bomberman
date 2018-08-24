import { createServer } from 'http';
import * as socketIo from 'socket.io';
import { BombermanSocketServer } from './comm';
import { GameManager } from './core';
import { CliManager } from './cli/cli';
const minimist = require('minimist');

const http = createServer();
const io = socketIo.default(http);

// Parsing the given arguments in order to configure the server.
/**
 * Allowed aguments are:
 * --port: The port that this server will listen on.
 */
const args = minimist(process.argv.slice(2)); // The first 2 arguments are useless.
const PORT = args.port || 3000;

const socketCommunication = new BombermanSocketServer(io);

socketCommunication.start();

http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const gameManager = new GameManager();
const cli = new CliManager(gameManager);
gameManager.startGame();

setTimeout( () => gameManager.stopGame(), 3000);



// Cleaning up all the resources used by the server.
function cleanUpResources() {
    console.log("Cleaning up resources."); 
    gameManager.cleanUpResources();
    cli.cleanUpResources();
    console.log("Closing server."); 
}

//do something when app is closing
process.on('exit', cleanUpResources);

//catches ctrl+c event
process.on('SIGINT', cleanUpResources);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', cleanUpResources);
process.on('SIGUSR2', cleanUpResources);

//catches uncaught exceptions
process.on('uncaughtException', cleanUpResources);


