const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../../models/user-model");

// POST /login
const login = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email name is required")
    .isEmail()
    .withMessage("Invalid email")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isAlphanumeric()
    .withMessage("Passwords must contain only letters and numbers")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation error", data: errors.array() });
    }

    const user = await UserModel.findOne({ email: req.body.email })
      .lean()
      .exec();

    if (!user) {
      await body("email")
        .custom(() => {
          throw new Error("Invalid email");
        })
        .run(req);

      return res
        .status(401)
        .json({ message: "Unauthorized", data: validationResult(req).array() });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      await body("password")
        .custom(() => {
          throw new Error("Invalid password");
        })
        .run(req);

      return res.status(401).json({
        message: "Unauthorized",
        data: validationResult(req).array(),
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ userId: user._id });
  }),
];

module.exports = login;
