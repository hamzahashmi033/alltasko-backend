const express = require("express");
const router = express.Router();
const categiryController = require("../controllers/CategoryControllers");


// admin
router.post("/check-category-and-subcategories", categiryController.checkCategory)


router.get("/search-subcategories", categiryController.searchSubSubcategories);

router.get("/get-subcategories", categiryController.getSubCategories)
router.get("/get-subsubCategoires", categiryController.getsubsubCategories)
router.post("/find-hierarchy", categiryController.findHierarchyBySubSubcategory);

module.exports = router;