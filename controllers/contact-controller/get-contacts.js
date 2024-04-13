const asyncHandler = require("express-async-handler");
const { param, validationResult } = require("express-validator");
const UserModel = require("../../models/user-model");
const ContactModel = require("../../models/contact-model");

// GET /users/:user_id/contacts
const getContacts = [
  param("user_id").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation error", data: errors.array() });
    }

    const [user, contacts] = await Promise.all([
      UserModel.findById(req.params.user_id).lean().exec(),
      ContactModel.find({
        portalOwnerId: req.params.user_id,
      }).exec(),
    ]);

    if (!user) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({
      contacts,
    });
  }),
];

module.exports = getContacts;
