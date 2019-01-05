import { createServer } from 'http';
import { RedisPresence, Server } from "colyseus";
import { config } from './server.config';
import { RoomHandler } from './rooms';

const minimist = require('minimist');

const http = createServer();
const gameServer = new Server({
    server: http,
    presence: new RedisPresence({
        host: config.redisHost,
        port: config.redisPort
    })
});


gameServer.register("dci", RoomHandler).
      on("create", (room) => console.log("Room created:", room.roomId)).
      on("dispose", (room) => console.log("Room disposed:", room.roomId)).
      on("join", (room, client) => console.log("User", client.id, "joined room", room.roomId)).
      on("leave", (room, client) => console.log("User", client.id, "left room", room.roomId));



// Parsing the given arguments in order to configure the server.
/**
 * Allowed aguments are:
 * --port: The port that this server will listen on.
 */
const args = minimist(process.argv.slice(2)); // The first 2 arguments are useless.
const PORT = args.port || 3000;

http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


// Cleaning up all the resources used by the server.
function cleanUpResources() {
    console.log("Server is closed.");
}

gameServer.onShutdown(cleanUpResources);

//do something when app is closing
/*process.on('exit', cleanUpResources);

//catches ctrl+c event
process.on('SIGINT', cleanUpResources);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', cleanUpResources);
process.on('SIGUSR2', cleanUpResources);

//catches uncaught exceptions
process.on('uncaughtException', cleanUpResources);
*/

