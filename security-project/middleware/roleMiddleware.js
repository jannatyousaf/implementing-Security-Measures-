function checkRole(role) {
  return (req, res, next) => {

    // JWT se user data lena
    const user = req.user;

    // role check
    if (!user || user.role !== role) {
      return res.status(403).send('Access denied');
    }

    next();
  };
}

module.exports = checkRole;