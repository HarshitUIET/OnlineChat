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


const login = (req,res) => {
  res.send("Hello world");
}

export {login,newUser};