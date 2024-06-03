import { compare } from 'bcrypt';
import {User} from '../models/user.js';
import {sendToken} from '../utilis/features.js'

const avatar = {
  public_id : "ssede",
  url : 'assssa'
}

const newUser = async (req,res) => {

  const {name,username,Bio,password} = req.body;

  console.log(name);
  
  const avatar = {
    public_id : "ssede",
    url : 'assssa'
  }

   const user = await User.create({
    name,
    username,
    Bio,
    password,
    avatar
  });
    
   sendToken(res,user,201,"User created successfully");
}


const login = async (req,res) => {

  const {username,password} = req.body;

  const user = await User.findOne({username}).select("+password");

  console.log(user.password);

  if(!user) return res.status(400).json("Invalid Username");

  const isMatch = await compare(password,user.password);

  console.log(isMatch);

  if(!isMatch) return res.status(400).json("Invalid Password");
    
  sendToken(res,user,200,`Welcome Back , ${user.name} `);




}

export {login,newUser};