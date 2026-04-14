const express = require("express");
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT;


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/generate", require("./routes/generateRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoute"));

app.listen(port, () => {
  console.log("Server started");
});