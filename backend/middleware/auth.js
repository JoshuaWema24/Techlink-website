const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'joshujoshu'); // use env in production
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};