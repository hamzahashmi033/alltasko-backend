const express = require("express");
const router = express.Router();
const categiryController = require("../controllers/CategoryControllers");


// admin
router.post("/check-category-and-subcategories", categiryController.checkCategory)


router.get("/search-subcategories", categiryController.searchSubSubcategories);

router.get("/get-subcategories", categiryController.getSubCategories)
router.get("/get-subsubCategoires", categiryController.getsubsubCategories)
router.post("/find-hierarchy", categiryController.findHierarchyBySubSubcategory);

router.get("/categories", categiryController.getCategories);
router.get("/sub-cat/:category", categiryController.getSubcategoriesByCategory);

router.post("/get-category-pricing", categiryController.getCategoryPricing)
router.get("/get-all-categories", categiryController.getAllCategories)
router.put("/update-category-pricing/:id", categiryController.updateCategoryPricing)
router.post("/create-category", categiryController.createCategory)
router.delete("/delete-category/:id", categiryController.deleteCategory)
module.exports = router;