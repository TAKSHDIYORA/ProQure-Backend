const UserModel = require("../models/User");

const getUsers = async (req,res)=>{
    try{
        const users = await UserModel.find();
        res.status(200);
        res.json(users);
    }catch(err){
        console.log(err);  
    }
}

const addUser = async (req,res)=>{
      try{
         const user = req.body;
         await UserModel.insertOne(user);
         res.status(201);
         res.json({"message": "user created successfully!!!"});
      }catch(err){
         console.log(err);
      }
}

const updateUser = async (req,res) =>{
    try{
        const newUser = req.body;
        const  user = UserModel.findOne({'name' : newUser.userId});
        if(!user){
            res.json("user not found");
        }
        UserModel.updateOne();
    }catch(err){
        console.log(err);        
    }
}

module.exports = {getUsers,addUser};