const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY"); // Use the same secret key as in the login route
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};
