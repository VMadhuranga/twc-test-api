const express = require("express");
const contactController = require("../controllers/contact-controller/");

const router = express.Router();

router.post("/:user_id/contacts", contactController.createContact);
router.get("/:user_id/contacts", contactController.getContacts);

module.exports = router;
