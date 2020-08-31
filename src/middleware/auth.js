import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token,"SocialNetwork");
        const user = await UserModel.findOne({
            token:token
        });

        if (!user){
            return res.status(401).send({message:"Sorry, you are not authorized."});
        };

        req.user = user;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(401).send({message:"Sorry, you are not authorized."});
    }
}

export default auth;