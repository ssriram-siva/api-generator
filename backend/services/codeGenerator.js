module.exports = ({ apiName, mode, method, fields, route }) => {
  const name = apiName?.toLowerCase() || "api";
  const fieldList = fields?.join(", ") || "";
  const validation = fields?.map(f => `!${f}`).join(" || ") || "false";

  const selectedMethod = method?.toLowerCase() || "post";
  const selectedRoute = route || "/";

  // 🔥 FIX: choose body or query
  const dataSource = selectedMethod === "get" ? "req.query" : "req.body";

  // 🟢 SINGLE API MODE
  const singleCode = `
router.${selectedMethod}('${selectedRoute}', (req, res) => {
  const { ${fieldList} } = ${dataSource};

  ${selectedMethod === "post" ? `
  if (${validation}) {
    return res.status(400).json({
      success: false,
      message: "Missing fields"
    });
  }
  ` : ""}

  res.json({
    success: true,
    message: "${method} ${apiName} success"
  });
});
`;

  // 🔵 CRUD MODE
  const crudCode = `
// CREATE
router.post('/', (req, res) => {
  const { ${fieldList} } = req.body;

  if (${validation}) {
    return res.status(400).json({
      success: false,
      message: "Missing fields"
    });
  }

  const item = { id: Date.now(), ${fieldList} };

  res.status(201).json({
    success: true,
    data: item
  });
});

// READ
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  res.json({
    success: true,
    message: "Updated successfully"
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  res.json({
    success: true,
    message: "Deleted successfully"
  });
});
`;

  // 🟣 CUSTOM ROUTE MODE (FIXED 🔥)
  const customCode = `
router.${selectedMethod}('${selectedRoute}', (req, res) => {
  const { ${fieldList} } = ${dataSource};

  ${selectedMethod === "post" || selectedMethod === "put" ? `
  if (${validation}) {
    return res.status(400).json({
      success: false,
      message: "Missing fields"
    });
  }
  ` : ""}

  res.json({
    success: true,
    message: "${method} ${selectedRoute} success"
  });
});
`;

  // 🎯 MODE SWITCH
  let finalRoutes = "";

  if (mode === "crud") {
    finalRoutes = crudCode;
  } else if (mode === "custom") {
    finalRoutes = customCode;
  } else {
    finalRoutes = singleCode;
  }

  return {
    server: `
const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/${name}', require('./routes/${name}Routes'));

app.listen(3000, () => console.log('Server running on port 3000'));
`,

    routes: `
const express = require('express');
const router = express.Router();

${finalRoutes}

module.exports = router;
`
  };
};