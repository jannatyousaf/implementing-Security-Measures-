const apiKeyAuth = (req, res, next) => {

  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== 'mysecretkey123') {
    return res.status(403).send('Access denied. Invalid API key.');
  }

  next();
};

module.exports = apiKeyAuth;