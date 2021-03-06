require("../core/colyseusjs.polyfill");

import { createServer } from "http";
import express, { Response, Request } from "express";
import bodyParser from "body-parser";

import { config } from "../global.config";
import { ServerConnected, ServerDisconnected, JoinGame } from "./routes";
import { ServerManager } from "./managers";
import { Server } from "colyseus";
import { LoadBalancerRoom } from "./load-balancer.room";

const app = express();

// Parsing all request bodies into json.
app.use(bodyParser.json());

const LOAD_BALANCER_PORT = config.loadBalancerPort;
const API_PORT = config.loadBalancerApiPort;

app.listen(API_PORT, () => {
    console.log(`Load balancer api is listening on port ${API_PORT}`);
});

app.get("/connect", ServerConnected);
app.get("/disconnect", ServerDisconnected);
app.get("/join-game", JoinGame);

app.get("*", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the load balancer!");
});

const gameServer = new Server({
    server: createServer(app)
});

gameServer.register("load-balancer", LoadBalancerRoom).then(handler =>
    handler
        .on("create", room =>
            console.log("Load balancer room created:", room.roomId)
        )
        .on("dispose", room =>
            console.log("Load balancer room disposed:", room.roomId)
        )
        .on("join", (room, client) =>
            console.log("User", client.id, "joined Load balancer", room.roomId)
        )
        .on("leave", (room, client) =>
            console.log("User", client.id, "left Load balancer", room.roomId)
        )
);

gameServer.matchMaker.create("load-balancer", {});

gameServer.listen(LOAD_BALANCER_PORT);

// Cleaning up all the resources used by the server.
function cleanUpResources(error: any, s: string) {
    console.log(error);
    ServerManager.cleanUp();
    app.removeAllListeners();
    gameServer.gracefullyShutdown();
}

// do something when app is closing
process.on("exit", e => cleanUpResources(e, "exit"));

// catches ctrl+c event
process.on("SIGINT", e => cleanUpResources(e, "SIGINT"));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", e => cleanUpResources(e, "SIGUSR1"));
process.on("SIGUSR2", e => cleanUpResources(e, "SIGUSR2"));

// catches uncaught exceptions
process.on("uncaughtException", e => cleanUpResources(e, "uncaughtException"));
