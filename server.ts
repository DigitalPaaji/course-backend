
import express from "express";
import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.ts"
import courseRoute from "./routes/courseRoute.ts"
import userRoute from "./routes/userRoutes.ts"
import cors from "cors"
import path from "path";
import cookie_parser from "cookie-parser"
const app = express();

app.use(express.json());



app.use(cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,               
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(cookie_parser())
// app.use(
//   "/uploads",
//   express.static(path.join(process.cwd(), "uploads"))
// );
app.use(
  "/videos",
  express.static(path.join(process.cwd(), "uploads","videos"))
);

app.get("/",(req,res)=>{
  res.json({server:"running"})
}
)

app.use("/api/v1/admin",adminRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/user",userRoute)





const PORT = process.env.PORT 



mongoose.connect(process.env.DB_URL!).then(()=>{


app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})

})


