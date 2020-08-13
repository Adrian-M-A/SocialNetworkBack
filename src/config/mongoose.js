const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Adrian:s0c19lnt@cluster0.u9ok9.mongodb.net/test?authSource=admin&replicaSet=atlas-5cce1k-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

const db = mongoose.connect(MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("Succesfully connected to MongoDB."))
.catch(console.error);

module.exports = db