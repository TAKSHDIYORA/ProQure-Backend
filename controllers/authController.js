const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async(req,res) =>{
    try{

        const {name, email,password, role} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message : 'User already exists'});
        }
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        if(user){
            res.status(201).json({
                _id: user._id,
                name : user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id,user.role),
            });
        }
    }catch(err){
         res.status(500).json({message: err.message});
    }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {register,login};