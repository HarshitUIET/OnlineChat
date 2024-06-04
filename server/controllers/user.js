import { compare } from 'bcrypt';
import {User} from '../models/user.js';
import {sendToken} from '../utilis/features.js'
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utilis/utility.js';

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


const login = TryCatch(async (req,res,next) => {

  
  const {username,password} = req.body;

const user = await User.findOne({username}).select("+password");


if(!user) return next(new ErrorHandler("Invalid Username or Password",404));

const isMatch = await compare(password,user.password);


if(!isMatch) return next(new ErrorHandler("Invalid  or Password",404));
  
sendToken(res,user,200,`Welcome Back , ${user.name} `);



})


const getMyProfile = TryCatch(async (req,res,next) => {

  const user = await User.findById(req.user);

  res.status(200).json({
    success : true,
    user

  })

});

export {login,newUser,getMyProfile};