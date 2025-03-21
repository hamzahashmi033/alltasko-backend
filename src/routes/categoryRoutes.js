const express = require("express");
const router = express.Router();
const userController = require("../controllers/CategoryControllers");

router.post("/check-category-and-subcategories", userController.checkCategory)
module.exports = router;