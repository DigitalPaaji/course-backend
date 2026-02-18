import express, { Router } from "express"
import { addnewChepter, creatCourse, deleteChapter, deleteCourse, deletOnelesson, getAllCoruse, getSingleCourseDetaile, uploadVideolession } from "../controller/coursecontroller.ts";
import upload from "../helper/upload.ts";
const route = express.Router();


route.post("/create",creatCourse)
route.get("/get/:slug",getSingleCourseDetaile)
route.put("/addchepter/:id",addnewChepter)
route.post(
  "/upload-video/:courseid",
  upload.single("video"),
  uploadVideolession

);

route.get("/all/get",getAllCoruse)
route.put("/delete/lession/:courseid",deletOnelesson)
route.put("/delete/chapter/:courseid",deleteChapter)
route.delete("/delete/course/:courseid",deleteCourse)
export default route;