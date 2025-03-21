const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");
const { verifyToken } = require("../middlewares/verifyTokens");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/admin-account-creation", userController.adminAccountCreation)
router.post("/send-verification", userController.sendVerificationCode);
router.post("/verify-and-register", userController.verifyCodeAndRegister);
router.post("/login", verifyToken, userController.loginUser)
router.delete('/delete', verifyToken, userController.deleteUser)
router.put("/change-password", verifyToken, userController.changePassword);
router.get('/me', verifyToken, userController.getUserDetails)
module.exports = router;
