const express = require("express");
const router = express.Router();
const generate = require("../controllers/generateController");

router.post("/", generate);

module.exports = router;