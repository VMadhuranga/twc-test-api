const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user-model");

// POST /refresh
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = await UserModel.findById(decoded.userId).lean().exec();

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        { userId: user._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      res.json({ accessToken });
    }),
  );
};

module.exports = refresh;
