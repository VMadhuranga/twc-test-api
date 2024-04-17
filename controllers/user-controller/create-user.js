const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const UserModel = require("../../models/user-model");

// POST /users
const createUser = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .escape()
    .custom(async (value) => {
      const user = await UserModel.findOne({ email: value }).lean().exec();

      if (user) {
        throw new Error("User with this email already exists");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password is required")
    .isAlphanumeric()
    .withMessage("Passwords must contain only letters and numbers")
    .escape(),
  body("confirm_password")
    .trim()
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation error", data: errors.array() });
    }

    const newUser = new UserModel({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  }),
];

module.exports = createUser;
