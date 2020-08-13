const express = require('express');
require ('./src/config/mongoose.js');
const cors = require('./src/middleware/cors.js');

const app = express();
const PORT = 3000;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => console.log("Server running on PORT " + PORT));