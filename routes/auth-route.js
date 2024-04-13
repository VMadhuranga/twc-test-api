const express = require("express");
const authController = require("../controllers/auth-controller/");

const router = express.Router();

router.post("/login", authController.login);
router.get("/refresh", authController.refresh);

module.exports = router;
