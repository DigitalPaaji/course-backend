import express from "express"
import { adminLogin, createAdmin, getAdmin, logoutAdmin } from "../controller/adminController.ts";
import { verifyAdmin } from "../middlewere/adminVerify.ts";
const route = express.Router();

route.post("/create",createAdmin)
route.post("/login",adminLogin)
route.get("/getadmin",verifyAdmin as any ,getAdmin as any)
route.get("/logout",verifyAdmin as any ,logoutAdmin as any)


export default route;
