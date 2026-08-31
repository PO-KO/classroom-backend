import AgentAPI from "apminsight";
AgentAPI.config();

import express from "express";
import "dotenv/config";
import subjectRouter from "./routes/subjectRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import classRouter from "./routes/classRoute.js";

const app = express();
const PORT = process.env.PORT || 8000;
const API_PREFIX = process.env.API_PREFIX || "/api";

if (!process.env.FRONTEND_URL)
  throw new Error("Frontend URL is not provided in .env file");

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://classroom-frontend-gotvx8v0v-po-kos-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all(`${API_PREFIX}/auth/{*splat}`, toNodeHandler(auth));

app.use(express.json());
app.use(securityMiddleware);

// Routes
app.use(`${API_PREFIX}/subjects`, subjectRouter);
app.use(`${API_PREFIX}/users`, userRouter);
app.use(`${API_PREFIX}/classes`, classRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Classroom API is up and running 🎓" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
