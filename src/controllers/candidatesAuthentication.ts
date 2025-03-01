import { CookieOptions, Response, NextFunction, Request } from "express";
import * as jwt from "jsonwebtoken";
import Candidate, {
  candidateValidation,
  ICandidate,
} from "../models/Candidate";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";

export interface AuthenticatedCandidateRequest extends Request {
  user: ICandidate;
}

// candidate sign token
const candidateSignToken = (id: string) => {
  const jwtSecret = process.env.CANDIDATE_JWT_SECRET;
  if (!jwtSecret) throw new Error("jwt secret is required");
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "2hrs",
  });
};

//create token and send response
export const createToken = (
  user: ICandidate,
  statusCode: number,
  res: Response
): void => {
  const token = candidateSignToken(user._id);

  // cookie options
  const cookiesOptions: CookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };
  res.cookie("token", token, cookiesOptions);

  // removes the password from the response object
  const { password, ...userWithoutPassword } = user.toObject();

  res.status(statusCode).json({
    status: "success",
    token,
    user: userWithoutPassword,
  });
};

//register candidate
export const registerCandidate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, phone, score, exam } = req.body;

    // parse the request body to zod for validation
    const parsedSchema = candidateValidation.safeParse({
      firstname,
      lastname,
      email,
      phone,
      exam,
      score,
    });

    // runs this if validation fails
    if (!parsedSchema.success) {
      const errorMessages = Object.values(
        parsedSchema.error.flatten().fieldErrors
      )
        .flat()
        .join(", ");
      return next(new AppError(`Invalid Input: ${errorMessages}`, 400));
    }

    // checks if the candidate exists
    const existingCandidate = await Candidate.findOne({ email });

    //if candidate exists throw an error
    if (existingCandidate)
      return next(
        new AppError("Candidate with that email already exists", 401)
      );

    //if candidate doesn't exist create a new candidate with the data returned from zod
    const newUser = await Candidate.create(parsedSchema.data);

    //send token with the new user
    createToken(newUser, 201, res);
  }
);

//login candidate
export const loginCandidate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //destructure the email and exam code from the request body
    const { email, examCode } = req.body;

    //if email or exam code doesn't exist throw an error
    if (!email || !examCode)
      return next(new AppError("email and examcode are required", 404));

    //check if the candidate with the email and exam code exists
    const activeUser = await Candidate.findOne({ email, examCode });

    //if the user doesn't exist or the exam code doesn't match the one in the database throw an error
    if (!activeUser || !activeUser.verifyExamCode(examCode)) {
      return next(new AppError("Invalid email or exam code", 404));
    }

    //if the user exists and the exam code matches send a token with the user data
    createToken(activeUser, 200, res);
  }
);

//protect routes
export const authenticateCandidate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    //checks if there is an authorization header in the request and extract the jwt token from it
    if (
      req.headers.authorization &&
      req.headers.authorization.includes("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //if there is no token throw an error
    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    const jwtSecret = process.env.CANDIDATE_JWT_SECRET;

    // checks if the token is valid
    const decoded = jwt.verify(token, jwtSecret as string) as jwt.JwtPayload;

    //if the token isn't valid throw an error
    if (!decoded) {
      return next(
        new AppError("Token is invalid, please login and try again", 401)
      );
    }

    //if the token is valid find the user with the decoded id
    const candidate = await Candidate.findById(decoded.id);

    //if the user doesn't exist throw an error
    if (!candidate) {
      return next(
        new AppError("The user belonging to this token not found", 401)
      );
    }

    //if the user exists set it as the authenticated user in the request
    (req as AuthenticatedCandidateRequest).user = candidate;

    //if all checks pass continue to the next middleware or route handler
    next();
  }
);
