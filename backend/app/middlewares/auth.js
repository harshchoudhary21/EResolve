const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const accessToken = req.header('Authorization');

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid accessToken' });
  }
};

module.exports = protect;