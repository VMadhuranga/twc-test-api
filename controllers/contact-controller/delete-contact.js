const asyncHandler = require("express-async-handler");
const { param, validationResult } = require("express-validator");
const ContactModel = require("../../models/contact-model");

// DELETE /users/:user_id/contacts/:contact_id
const deleteContact = [
  param("user_id").trim().isMongoId().escape(),
  param("contact_id").trim().isMongoId().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await ContactModel.findByIdAndDelete(req.params.contact_id).exec();

    res.json({ message: "Contact deleted successfully" });
  }),
];

module.exports = deleteContact;
