import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./db/db";
import { globalErrorHandler } from "./utils/errorHandler";

import adminRouter from "./routes/adminRoutes";
import candidateRouter from "./routes/candidateRoutes";
import examRouter from "./routes/examRoutes";
import courseRouter from "./routes/courseRoutes";
import questionRouter from "./routes/questionRoutes";
import attemptRouter from "./routes/examAttemptRoutes";
import answerRouter from "./routes/answersRoutes";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/attempt", attemptRouter);
app.use("/api/v1/answer", answerRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

app.use(globalErrorHandler);
