import mongoose from 'mongoose';


const MessageSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    socialGroup: {
        type: String,
        required: true
    }

},{
    timestamps : true
    
})

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;