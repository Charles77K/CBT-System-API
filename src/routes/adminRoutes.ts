import express from "express";
import {
  getMe,
  loginUser,
  logout,
  protect,
  registerUser,
} from "../controllers/authController";

const adminRouter = express.Router();

adminRouter.route("/signup").post(registerUser);

adminRouter.route("/login").post(loginUser);

adminRouter.use(protect);

adminRouter.route("/logout").post(logout);

adminRouter.route("/me").get(getMe);

export default adminRouter;
