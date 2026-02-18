import express from "express"
import { createUser, deleteStudent, getAllStudent, getCourse, getUser, loginUser, logoutUser } from "../controller/userController.ts";
import { verifyUser } from "../middlewere/userVerify.ts";
const route = express.Router();

route.post("/create",createUser)
route.get("/getall",getAllStudent)
route.delete("/delete/:id",deleteStudent)
route.post("/login",loginUser);
route.get("/get",verifyUser as any ,getUser as any)
route.get("/getcourse",verifyUser as any ,getCourse as any)
route.get("/logout",verifyUser as any ,logoutUser as any)


export default route