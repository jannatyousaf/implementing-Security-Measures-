const failedAttempts = {};

const loginMonitor = (req, res, next) => {

  const ip = req.ip;

  // Agar IP already blocked hai
  if (
    failedAttempts[ip] &&
    failedAttempts[ip].count >= 3
  ) {
    return res.status(429).send('Too many failed login attempts. Try again later.');
  }

  next();
};

const recordFailedAttempt = (ip) => {

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = {
      count: 0
    };
  }

  failedAttempts[ip].count++;

  console.log(`Failed attempts from ${ip}: ${failedAttempts[ip].count}`);

  // Alert after 3 failed attempts
  if (failedAttempts[ip].count >= 3) {
    console.log('⚠ Suspicious activity detected!');
  }
};

module.exports = {
  loginMonitor,
  recordFailedAttempt
};