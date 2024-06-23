import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();
const app = express();

//middleware
app.use(cors({
  origin: ["https://master--benevolent-bunny-654aba.netlify.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production once built this project
app.use(morgan("dev"));

// Mount the router for the "/api/v1" prefix
app.use("/api/v1",appRouter);

export default app;