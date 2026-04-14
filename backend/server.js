const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// APIs
app.use("/api/generate", require("./routes/generateRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoute"));

// serve frontend
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API test route
app.get("/api", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// ✅ FIXED fallback (NO "*" route)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
