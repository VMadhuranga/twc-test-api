const asyncHandler = require("express-async-handler");
const { body, param, validationResult } = require("express-validator");
const ContactModel = require("../../models/contact-model");

// POST /users/:user_id/contacts
const createContact = [
  param("user_id").trim().isMongoId().escape(),

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
    .withMessage("Email name is required")
    .isEmail()
    .withMessage("Invalid email")
    .escape()
    .custom(async (value, { req }) => {
      const contact = await ContactModel.findOne({
        email: value,
        portalOwnerId: req.params.user_id,
      })
        .lean()
        .exec();

      if (contact) {
        throw new Error("Contact with this email already exists");
      }
    }),
  body("phone_number")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Phone number is required")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .escape()
    .custom(async (value, { req }) => {
      const contact = await ContactModel.findOne({
        phoneNumber: value,
        portalOwnerId: req.params.user_id,
      })
        .lean()
        .exec();

      if (contact) {
        throw new Error("Contact with this phone number already exists");
      }
    }),
  body("gender")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Gender is required")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const paramsErrors = errors
      .array()
      .filter((error) => error.location === "params");
    const bodyErrors = errors
      .array()
      .filter((error) => error.location === "body");

    if (paramsErrors.length > 0) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (bodyErrors.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation error", data: bodyErrors });
    }

    const newContact = new ContactModel({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      phoneNumber: req.body.phone_number,
      gender: req.body.gender,
      portalOwnerId: req.params.user_id,
    });

    await newContact.save();

    res.status(201).json({ message: "Contact created successfully" });
  }),
];

module.exports = createContact;
