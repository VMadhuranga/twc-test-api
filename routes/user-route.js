const express = require("express");
const userController = require("../controllers/user-controller/");
const contactRouter = require("./contact-route");

const router = express.Router();

router.post("/", userController.createUser);

router.use("/", contactRouter);

module.exports = router;
