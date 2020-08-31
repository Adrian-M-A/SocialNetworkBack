import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Adrian:s0c19lnt@cluster0.u9ok9.mongodb.net/socialnetwork';

const db = mongoose.connect(MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log("Succesfully connected to MongoDB."))
.catch(console.error);

export default db;