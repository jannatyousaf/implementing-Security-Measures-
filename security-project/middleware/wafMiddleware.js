const suspiciousPatterns = [
  "<script>",
  "DROP TABLE",
  "' OR 1=1",
  "../",
  "UNION SELECT"
];

const wafMiddleware = (req, res, next) => {

  const requestData = JSON.stringify(req.body) + req.url;

  for (const pattern of suspiciousPatterns) {

    if (requestData.includes(pattern)) {

      console.log("🚨 WAF Blocked Suspicious Request");

      return res.status(403).send("Suspicious activity detected");
    }
  }

  next();
};

module.exports = wafMiddleware;