import { Document, model, Schema, Types } from "mongoose";

export interface ICourse {
  course: Types.ObjectId;
  enrolledAt: Date;
  expireAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  course: ICourse[];
}



const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true, 
     required: true,
  },
  course:[

{
    course:{type:Schema.Types.ObjectId,
        ref:"course"
    },
     enrolledAt:Date,
     expireAt:Date
}



  ]
},{timestamps:true});


const User = model<IUser>("user",userSchema)
export default User;