import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import proposeRoutes from "./routes/propose.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "One Question API 💖",
    status: "running",
  });
});

// Routes
app.use("/api/propose", proposeRoutes);

// Connect to MongoDB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✨ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
