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

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/exam", examRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

app.use(globalErrorHandler);
