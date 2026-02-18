import { model, Schema, Types } from "mongoose";

interface IChapter {
  title: string;
  lectures: Types.ObjectId[];
}


export interface ICourse extends Document {
  courseName: string;
  slug: string;
  description?: string;
  price: number;
  chapters: IChapter[];
  isPublished: boolean;
}



const chapterSchema = new Schema<IChapter>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson", 
      },
    ],
  },
);


const courseSchema = new Schema<ICourse>({
   courseName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
description: {
      type: String,
    },

price: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
   chapters: [chapterSchema],

},{
    timestamps:true
})

const Course = model<ICourse>("course",courseSchema)



export default Course;





