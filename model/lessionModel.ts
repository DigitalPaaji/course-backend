import { Schema, model, Document, Types } from "mongoose";

/* ============================= */
/* Interface                     */
/* ============================= */

export interface ILesson extends Document {
  title: string;
  videoUrl: string;
  duration: number; // in seconds

}

/* ============================= */
/* Schema                        */
/* ============================= */

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ============================= */


const Lesson = model<ILesson>("Lesson", lessonSchema);

export default Lesson;
