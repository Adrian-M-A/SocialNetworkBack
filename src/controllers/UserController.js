import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserController = {
    // User registration
    async register(req,res) {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const user = await UserModel.create(req.body);
            res.status(201).send(user);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to register this user."})
        }
    },
    // User login
    async login(req,res) {
        try {
            const user = await UserModel.findOne({
                email: req.body.email
            });

            if(!user){
                return res.status(400).send({message:"Wrong credentials"})
            } else{
                let { password } = req.body;
                let checkPassword = await bcrypt.compare(password, user.password);

                if(!checkPassword){
                    res.status(401).send({message:"User not found or wrong password"});
                    return;
                }

                const token = jwt.sign({
                   _id: user._id
                }, 'SocialNetwork');

                await UserModel.findByIdAndUpdate(user._id, {
                    $push: {
                        token:token
                    }
                })
                res.send({
                    user,
                    token
                })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to log in this user."})
        }
    },
    // User logout
    async logout (req,res){
        try {
            await UserModel.findByIdAndUpdate(req.user._id, {
                $pull: {
                    token: req.headers.authorization
                }
            });
            
            res.send({message:"User succesfully logged out."})
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to log out this user."});
        }
    }
}

export default UserController;