import mongoose,{ Schema,Types } from "mongoose";

const schema = new Schema({
    content: {
        type: String,
    },
    attachments  : [
        {
            public_id : {
                type : String,
                required : true
            },
            url : {
                type : String,
                required : true
            }
        }
    ],
    sender : {
        type : Types.ObjectId,
        ref : 'User',
        required : true
    },
    chat : {
        tupe : Types.ObjectId,
        ref : 'Chat',
        required : true
    }
},{
    timestamps : true
}); 


export const Message = mongoose.models.Message || model('Message',schema);

