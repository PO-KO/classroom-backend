import express from "express";
import subjectRouter from "./routes/subjectRoute.js";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL || "/api";

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use(`${BASE_URL}/subjects`, subjectRouter);

app.get("/", (_req, res) => {
  res.json({ message: "Classroom API is up and running 🎓" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
