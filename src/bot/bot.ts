require("../core/colyseusjs.polyfill");

import { Client, DataChange, Room } from "colyseus.js";
import { PlayerAction } from "../server/models";
import { GameFinder } from "./game-finder";
const minimist = require("minimist");
const uuid = require("uuid/v4");

// Parsing the given arguments in order to configure the server.
/**
 * Allowed aguments are:
 * --port: The port that this server will listen on.
 */
const args = minimist(process.argv.slice(2)); // The first 2 arguments are useless.

let interval: any;
let room: Room;
const botId = uuid();

GameFinder.next()
    .then(serverUrl => {
        console.log(serverUrl);
        const client = new Client("ws:" + serverUrl);
        client.id = botId;

        room = client.join("dci", { isPlaying: true, id: botId });

        room.onJoin.add(() => {
            console.log("Bot has joined room ", room.id);
        });

        client.onError.add((error: string) => {
            console.error("An error occurred: ", error);
        });

        room.listen("hasStarted", (change: DataChange) => {
            if (change.value === true) {
                console.log("Game has started.");
                sendRandomMoves();
            }
        });

        room.listen("isOver", (change: DataChange) => {
            if (change.value === true) {
                console.log("Game is over.");
                cleanUpResources();
            }
        });
    })
    .catch(err => console.error(err));

function sendRandomMoves() {
    interval = setInterval(() => {
        const randomMove = Math.floor(Math.random() * 5);
        const actions = new PlayerAction();

        if (randomMove === 0) {
            actions.move_down = true;
            console.log("Down");
        } else if (randomMove === 1) {
            actions.move_up = true;
            console.log("Up");
        } else if (randomMove === 2) {
            actions.move_left = true;
            console.log("Left");
        } else if (randomMove === 3) {
            actions.move_right = true;
            console.log("Right");
        } else {
            console.log("Stand still");
        }

        room.send({
            type: "PlayerAction",
            payload: { playerId: botId, actions }
        });
    }, 3000);
}

function cleanUpResources(ex?: any) {
    if (ex) {
        console.error(ex);
    }

    console.log("Cleaning up resources...");

    if (interval) {
        clearInterval(interval);
    }

    if (room && room.hasJoined) {
        room.leave();
    }

    process.exit();
}

// do something when app is closing
// process.on('exit', cleanUpResources);

// catches ctrl+c event
process.on("SIGINT", cleanUpResources);

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", cleanUpResources);
process.on("SIGUSR2", cleanUpResources);

// catches uncaught exceptions
process.on("uncaughtException", cleanUpResources);
