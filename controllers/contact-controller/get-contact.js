const asyncHandler = require("express-async-handler");
const { param, validationResult } = require("express-validator");
const UserModel = require("../../models/user-model");
const ContactModel = require("../../models/contact-model");

// GET /users/:user_id/contacts/:contact_id
const getContact = [
  param("user_id").trim().isMongoId().escape(),
  param("contact_id").trim().isMongoId().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const [user, contact] = await Promise.all([
      UserModel.findById(req.params.user_id).exec(),
      ContactModel.findById(req.params.contact_id).exec(),
    ]);

    if (!user) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({
      contact,
    });
  }),
];

module.exports = getContact;
