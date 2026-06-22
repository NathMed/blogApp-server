const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

// register
router.post("/register", userController.registerUser);

// login
router.post("/login", userController.loginUser);

// get user details
router.get("/details", verify, userController.getProfile);

// get all user
router.get("/allUser", verify, userController.getAllUser);

module.exports = router;