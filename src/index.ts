import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db";
import { globalErrorHandler } from "./utils/errorHandler";
import helmet from "helmet";
import compression from "compression";
import adminRouter from "./routes/adminRoutes";
import candidateRouter from "./routes/candidateRoutes";
import examRouter from "./routes/examRoutes";
import courseRouter from "./routes/courseRoutes";
import questionRouter from "./routes/questionRoutes";
import attemptRouter from "./routes/examAttemptRoutes";
import answerRouter from "./routes/answersRoutes";
import optionRouter from "./routes/optionRoutes";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

connectDB();

app.use("/api/v1/exam", examRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/attempt", attemptRouter);
app.use("/api/v1/answer", answerRouter);
app.use("/api/v1/option", optionRouter);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
