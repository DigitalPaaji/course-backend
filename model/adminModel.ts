import { Document, model, Schema } from "mongoose";

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
}




const adminSchema = new Schema<IUser>({
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

},{timestamps:true});


const Admin = model<IUser>("admin",adminSchema)
export default Admin;