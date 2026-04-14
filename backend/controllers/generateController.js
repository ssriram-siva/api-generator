const generateProject = require("../services/codeGenerator");

module.exports = (req, res) => {
  try {
    const { apiName, mode, method, fields } = req.body;

    if (!apiName || !mode) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const result = generateProject({
      apiName,
      mode,
      method,
      fields
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};