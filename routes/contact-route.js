const express = require("express");
const contactController = require("../controllers/contact-controller/");

const router = express.Router();

router.post("/:user_id/contacts", contactController.createContact);
router.get("/:user_id/contacts", contactController.getContacts);
router.put("/:user_id/contacts/:contact_id", contactController.updateContact);
router.delete(
  "/:user_id/contacts/:contact_id",
  contactController.deleteContact,
);

module.exports = router;
