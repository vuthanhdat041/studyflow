const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// Kết nối MongoDB Atlas/local qua MONGO_URI trong .env
// Ví dụ .env: MONGO_URI=mongodb+srv://user:pass@cluster/dbname
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Routes
const assignmentRoutes = require("./routes/assignmentRoutes");
app.get("/", (req, res) => res.send("StudyFlow API running"));
app.use("/api/assignments", assignmentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
