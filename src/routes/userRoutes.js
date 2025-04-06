const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { verifyToken } = require("../middlewares/verifyTokens");
// adimin
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
// admin
router.post("/admin-account-creation", userController.adminAccountCreation)
router.post("/send-verification", userController.sendVerificationCode);
router.post("/verify-and-register", userController.verifyCodeAndRegister);
router.post("/login", userController.loginUser)
router.delete('/delete', verifyToken, userController.deleteUser)
router.put("/change-password", verifyToken, userController.changePassword);
router.get('/me', verifyToken, userController.getUserDetails)
router.post("/forget-password", userController.sendResetPasswordCode)
router.post("/reset-password", userController.resetPassword)
module.exports = router;
