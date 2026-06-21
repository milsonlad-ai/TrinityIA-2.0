const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const TrinityIA = require("./main");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const trinity = new TrinityIA();

app.use(express.static("web"));

io.on("connection", (socket) => {
    console.log("painel conectado");

    socket.on("prompt", async (msg) => {
        console.log("prompt web:", msg);
        const resultado = await trinity.processAll(msg);
        socket.emit("resposta", resultado);
    });
});

server.listen(3000, () => {
    console.log("Trinity Web ativa em http://localhost:3000");
});
