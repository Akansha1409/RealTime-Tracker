const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

// Set view engine
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Handle socket connections
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle incoming location data
    socket.on("send-location", (data) => {
        console.log(`Received location from ${socket.id}:`, data);
        io.emit("receive-location", {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude
        });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Handle the root route
app.get("/", (req, res) => {
    res.render("index");
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
