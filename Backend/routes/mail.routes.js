const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mail.controller");
const { body, param } = require("express-validator");
const { authUser, authCaptain } = require("../middlewares/auth.middleware");
const { mailLimiter } = require("../middlewares/rateLimit.middleware");

router.get("/verify-user-email", authUser, mailLimiter, mailController.sendVerificationEmail);
router.get("/verify-captain-email", authCaptain, mailLimiter, mailController.sendVerificationEmail);

// Sends the "forgot password" email
router.post("/:userType/reset-password",
    mailLimiter,
    param("userType").isIn(["user", "captain"]).withMessage("Invalid user type"),
    body("email").isEmail().withMessage("Invalid Email"),
    mailController.forgotPassword
);


module.exports = router;
