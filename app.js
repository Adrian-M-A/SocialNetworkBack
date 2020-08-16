import express from 'express';
import './src/config/mongoose.js';
import cors from './src/middleware/cors.js';
import usersRouter from './src/routes/users.js';
import messagesRouter from './src/routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', usersRouter);
app.use('/messages', messagesRouter)


app.listen(PORT, () => console.log("Server running on PORT " + PORT));