const express = require("express");
const router = express.Router();
const userController = require("../controllers/CategoryControllers");


// admin
router.post("/check-category-and-subcategories", userController.checkCategory)
module.exports = router;