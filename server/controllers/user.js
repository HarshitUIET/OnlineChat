import {User} from '../models/user.js';

const avatar = {
  public_id : "ssede",
  url : 'assssa'
}

const newUser = async (req,res) => {

    await User.create({
      name : "Harshit",
      username : "Harsh@king",
      Bio : "I am a full stack developer",
      password : "harsh123@io",
      avatar
    })
    res.status(201).json({message : "User created successfully"});
}


const login = (req,res) => {
  res.send("Hello world");
}

export {login,newUser};