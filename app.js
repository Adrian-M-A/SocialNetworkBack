import express from 'express';
import './src/config/mongoose.js';
import cors from './src/middleware/cors.js';
import usersRouter from './src/routes/users.js';
import messagesRouter from './src/routes/messages.js';
import http from 'http';
import io from 'socket.io';

const app = express();
const httpApp =  http.Server(app);
const socketIO = io(httpApp)
const PORT = process.env.PORT || 3001;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', usersRouter);
app.use('/messages', messagesRouter)

httpApp.listen(PORT, function() {
    console.log('Server running on PORT ' + PORT);
})

//Socket.io for chat
socketIO.on('connection', function(socket) {

    socket.on("user_join", function(data) {
        socket.broadcast.emit("user_join", data);
    });

    socket.on("chat_message", function(data) {
        socket.broadcast.emit("chat_message", data);
    });

    socket.on("disconnect", function(data) {
        socket.broadcast.emit("user_leave", data);
    });
})

// app.listen(PORT, () => console.log("Server running on PORT " + PORT));