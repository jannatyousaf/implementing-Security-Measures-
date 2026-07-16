const apiKeyAuth = (req, res, next) => {

  const apiKey = req.header('x-api-key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).send('Access denied. Invalid API key.');
  }

  next();
};

module.exports = apiKeyAuth;