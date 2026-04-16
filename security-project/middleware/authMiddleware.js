const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.sendStatus(401);
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;