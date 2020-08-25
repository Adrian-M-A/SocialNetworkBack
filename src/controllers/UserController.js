import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserController = {
    // User registration
    async register(req,res) {
        try {
            let nameRegex = new RegExp("[0-9]");
            let surnamesRegex = new RegExp("[0-9]");
            let passwordRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

            if(req.body.name.length > 20 || req.body.name.length < 3 || nameRegex.test(req.body.name) || req.body.name === ""){
                res.send({message:"Name is not valid."});
                return;
            }
        
            if(req.body.surnames.length > 35 || req.body.surnames.length < 3 || surnamesRegex.test(req.body.surnames) || req.body.surnames === ""){
                res.send({message: 'Surnames are not valid.'});
                return;
            }

            if(!passwordRegex.test(req.body.password) || req.body.password === ""){
                res.send({message: 'Password must contain almost 1 uppercase, 1 lowercase, 1 symbol, 1 number and 8 characteres length.'});
                return;
            }
            

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
                res.status(201).send({
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
    async logout(req,res) {
        try {
            await UserModel.findByIdAndUpdate(req.params.id, {
                $pull: {
                    token: req.headers.authorization
                }
            });
            
            res.status(201).send({message:"User succesfully logged out."})
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to log out this user."});
        }
    },
    // Find user data
    async userData(req,res) {
        try {
            const id = req.params.id;
            const user = await UserModel.findById(id);
            res.status(201).send(user);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was a problem trying to get user' data."})
        }
    },
    // User update data
    async update(req,res) {
        try {
            const id = req.params.id;
            await UserModel.findByIdAndUpdate(id, {
                $push: {  
                    hobbies: req.body.hobbies,
                    imagesPath: {
                        $each: [req.body.imagesPath],
                        $position: 0
                    } ,
                                            
                }
            }, {new: true})

            await UserModel.findByIdAndUpdate(id, {
                $unset: {  
                    "imagesPath.3": 1,
                    "hobbies.1": 1
                }
            }, {new: true})
            
            await UserModel.findByIdAndUpdate(id, {
                $pull: {  
                    imagesPath: null,
                    hobbies: null
                }
            }, {new: true})
            
            const user = await UserModel.findByIdAndUpdate(id, {
                profession: req.body.profession,
            }, {new: true})
            res.status(201).send(user);

        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to update this user."})
        }
    },
    // Delete user
    async delete(req,res) {
        try {
            await UserModel.findByIdAndDelete(req.params.id);
            res.status(201).send({message:"User successfully deleted."});

        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to delete this user."})
        }
    },
    // Recommended friends
    async recommendedFriends(req,res) {
        try {
            const userCountry = req.params.country;
            const userId = req.params.id;
            const friends = await UserModel.find({ $and:
                [
                    { country: userCountry },
                    { _id: {$ne: userId}} 
                ]
                
            
            }).limit(15)
            res.status(201).send(friends);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to get users by the especified criteria."})
        }
    },
    // Search users by criteria
    async searchUsers(req,res) {
        try {
            const searchInput = req.params.input;
            const users = await UserModel.find( {$or: [
                {name: searchInput},
                {profession: searchInput},
                {hobbies: searchInput},
                {city: searchInput},
                {country: searchInput}                   
            ]}).limit(15)
            res.status(201).send(users);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to get users by the especified criteria."})
        }
    },
    // Get users between ages
    async betweenAges(req,res) {
        try {
            const minAge = req.params.minAge;
            const maxAge = req.params.maxAge;
            const userId = req.params.id;
            const users = await UserModel.find( {$and: [
                {age: {$gte: minAge}},
                {age: {$lte: maxAge}},
                { _id: {$ne: userId}}
            ]});
            res.status(201).send(users);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to get users between these ages."})
        }
    },
    // Between ages descendent
    async betweenAgesDesc(req,res) {
        try {
            const minAge = req.params.minAge;
            const maxAge = req.params.maxAge;
            const userId = req.params.id;

            const users = await UserModel.find( {$and: 
            [
                {age: {$gte: minAge}},
                {age: {$lte: maxAge}},
                { _id: {$ne: userId}}
            ]}).sort({age:-1});
            res.status(201).send(users);
            
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to get users between these ages."})
        }
    },
    // Friendship request
    async friendshipRequest(req,res) {
        try {
            const requesterId = req.body.requester;
            const receiverId = req.body.receiver;

            const requester = await UserModel.findById(requesterId);
            const receiver = await UserModel.findById(receiverId);
            await UserModel.findByIdAndUpdate(requesterId, {
                $push: {
                    pendingFriends: receiver
                }
            });
            await UserModel.findByIdAndUpdate(receiverId, {
                $push: {
                    pendingFriends: requester
                }
            });
            res.status(201).send({message:"Friendship request succesfully done."})
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to process the friendship request."})
        }
    },
    // Cancel friendship request
    async rejectFriendshipRequest(req,res) {
        try {
            const requesterId = req.body.requester;
            const receiverId = req.body.receiver;

            const requester = await UserModel.findById(requesterId);
            const receiver = await UserModel.findById(receiverId);
            
            await UserModel.findByIdAndUpdate(requesterId, {
                $pull: {
                    pendingFriends: {email:receiver.email}
                }
            });
            
            await UserModel.findByIdAndUpdate(receiverId, {
                $pull: {
                    pendingFriends: {email:requester.email}
                }
            });
            res.status(201).send({message:"Friendship request succesfully cancelled."})
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to cancel the friendship request."})
        }
    },
    // Accept friendship request
    async acceptFriendshipRequest(req,res) {
        try {
            const requesterId = req.body.requester;
            const receiverId = req.body.receiver;

            const requester = await UserModel.findById(requesterId);
            const receiver = await UserModel.findById(receiverId);
            
            await UserModel.findByIdAndUpdate(requesterId, {
                $pull: {
                    pendingFriends: {email:receiver.email}
                },
                $push: {
                    friends: receiver
                }
            });
            
            await UserModel.findByIdAndUpdate(receiverId, {
                $pull: {
                    pendingFriends: {email:requester.email}
                },
                $push: {
                    friends: requester
                }
            });
            res.status(201).send({message:"Friendship request succesfully accepted."})
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to accept the friendship request."})
        }
    },
    async cancelFriendship(req,res) {
        try {
            const requesterId = req.body.requester;
            const receiverId = req.body.receiver;

            const requester = await UserModel.findById(requesterId);
            const receiver = await UserModel.findById(receiverId);
            
            await UserModel.findByIdAndUpdate(requesterId, {
                $pull: {
                    friends: {email:receiver.email}
                }
            });
            
            await UserModel.findByIdAndUpdate(receiverId, {
                $pull: {
                    friends: {email:requester.email}
                }
            });
            res.status(201).send({message:"Friendship succesfully cancelled."})
        } catch (error) {
            console.error(error);
            res.status(500).send({message:"There was an error trying to cancel the friendship."})
        }
    }
};

export default UserController;