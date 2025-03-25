const express = require("express");
const router = express.Router();
const categiryController = require("../controllers/CategoryControllers");


// admin
router.post("/check-category-and-subcategories", categiryController.checkCategory)


router.get("/search-subcategories", categiryController.searchSubSubcategories);
module.exports = router;