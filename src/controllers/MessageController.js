import MessageModel from '../models/Message.js';

const MessageController = {
    // Create new message
    async newMessage(req,res) {
        try {
            const message = await MessageModel.create(req.body)
            res.status(201).send(message);

        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was an error trying to create the message.'})
        }
    },
    // Get all public messages
    async getMessages(req,res) {
        try {
            const messages = await MessageModel.find({
                
                socialGroup: 'public'

            }).sort({createdAt:-1}).limit(6);
            res.status(201).send(messages);

        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was an error trying to get all the public messages.'})
        }
    },
    // Get messages from thinkers group
    async thinkersMessages(req,res) {
        try {
            const messages = await MessageModel.find({

                socialGroup: 'thinkers'

            }).sort({createdAt:-1}).limit(6);
            res.status(201).send(messages);

        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was an error trying to get messages from pensadores group.'})
        }
    },
    async searchMessage(req,res) {
        try {
            const tag = req.params.tag
            const messages = await MessageModel.find({

                header:{$regex: `.*${tag}.*` }

            }).sort({createdAt:-1});
            res.status(201).send(messages);

        } catch (error) {
            console.error(error);
            res.status(500).send({message:'There was a problem trying to get the searched message.'})
        }
    }
};

export default MessageController