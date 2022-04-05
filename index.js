const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const vm = require('vm');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        socket.broadcast.emit('message',msg);
    });

    socket.on('run', (msg) => {
        let contextObj = {
            console: {
                log: (...args) => {
                    console.log("sending console message:"+args);
                    socket.broadcast.emit('consoleMessage', args);
                    socket.emit('consoleMessage', args);
                }
            }
        };

        console.log('try running:' + msg)
        vm.runInNewContext(msg, contextObj)
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});