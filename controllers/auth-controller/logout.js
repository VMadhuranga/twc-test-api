// GET /logout
const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  res.json({ message: "Cookie cleared" });
};

module.exports = logout;
