import mongoose, { mongo } from "mongoose";

const dbConnect = (url) => {
   mongoose.connect(url,{dbName:"chattu"})
   .then((data)=>{
    console.log(`connected to database ${data.connection.host}`)
   })
   .catch((err)=>{
    throw err;
   })
}

export {dbConnect};