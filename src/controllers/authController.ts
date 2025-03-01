import { Response, Request, NextFunction } from "express";
import Admin, { adminValidation, IAdmin } from "../models/Admin";
import * as jwt from "jsonwebtoken";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { Document } from "mongoose";

interface AuthenticatedRequest extends Request {
  user: IAdmin;
}

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure: boolean | undefined;
  sameSite?: "strict" | "lax" | "none";
}

//jwt signature
const adminSignToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("jwt secret is required");
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "30d",
  });
};

//create token and send response
export const createToken = (
  user: IAdmin,
  statusCode: number,
  res: Response
): void => {
  const token = adminSignToken(user._id);

  const cookiesOptions: CookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res.cookie("token", token, cookiesOptions);

  const { password, ...userWithoutPassword } = user.toObject();

  res.status(statusCode).json({
    status: "success",
    token,
    user: userWithoutPassword,
  });
};

export const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedUser = adminValidation.safeParse(req.body);
    if (!parsedUser.success) {
      const errorMessages = Object.values(
        parsedUser.error.flatten().fieldErrors
      )
        .flat()
        .join(", ");
      return next(new AppError(`Invalid Input: ${errorMessages}`, 400));
    }
    const { email } = req.body;

    const existingUser = await Admin.findOne({ email }).select("+password");

    if (existingUser)
      return next(
        new AppError("User with the same credentials already exists", 404)
      );

    const newUser = await Admin.create(parsedUser.data);

    createToken(newUser, 201, res);
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new AppError("Email and password fields are required", 400));

    const user = await Admin.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password))) {
      return next(new AppError("Invalid email or password", 404));
    }

    createToken(user, 200, res);
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // checks if there is an authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // throws an error if there is no token
    if (!token)
      return next(
        new AppError(
          "Unauthorized user, please login to access this route",
          401
        )
      );

    // checks if the token is valid
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    //if its not valid throw an error
    if (!decoded) {
      return next(
        new AppError("Token is invalid, please login and try again", 401)
      );
    }

    // if the token is valid, find the user and attach it to the request object
    const currentUser = await Admin.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token not found", 401)
      );
    }

    (req as AuthenticatedRequest).user = currentUser;
    next();
  }
);
