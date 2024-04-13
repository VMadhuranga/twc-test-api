const asyncHandler = require("express-async-handler");
const { param, validationResult } = require("express-validator");
const ContactModel = require("../../models/contact-model");

// DELETE /users/:user_id/contacts/:contact_id
const createContact = [
  param("user_id").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation error", data: errors.array() });
    }

    await ContactModel.findByIdAndDelete(req.params.contact_id).exec();

    res.json({ message: "Contact deleted successfully" });
  }),
];

module.exports = createContact;
