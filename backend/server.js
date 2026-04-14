const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

// ✅ FIX: fallback port
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/generate", require("./routes/generateRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoute"));

// 🔥 SERVE FRONTEND (IMPORTANT for Render)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// 🔥 ROOT CHECK
app.get("/api", (req, res) => {
  res.json({ message: "API running 🚀" });
});

// 🔥 React fallback (VERY IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// 🚀 START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
