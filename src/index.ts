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
import corsOptions from "./config/corsOptions.js";

const app = express();
const PORT = process.env.PORT || 8000;
const API_PREFIX = process.env.API_PREFIX || "/api";

// Middleware
app.use(cors(corsOptions));

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
