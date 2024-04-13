const express = require("express");
const userController = require("../controllers/user-controller/");
const contactRouter = require("./contact-route");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.post("/", userController.createUser);

router.use(authenticate);
router.use("/", contactRouter);

module.exports = router;
