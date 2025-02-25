import express from "express";
import { loginUser, registerUser } from "../controllers/authController";

const adminRouter = express.Router();

adminRouter.route("/signup").post(registerUser);

adminRouter.route("/login").post(loginUser);

export default adminRouter;
