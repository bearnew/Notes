const net = require("net");
const server1 = net.createServer().listen(80, "127.0.0.1");
server1.on("listening", function () {
    console.log("Server listening!");
});

const server2 = net.createServer().listen(80, "127.0.0.1");
server2.on("listening", function () {
    console.log("Server listening!");
});

server2.on("error", function (error) {
    console.error("1111", error.message); // 1111 listen EADDRINUSE: address already in use 127.0.0.1:80
});
