const express = require("express");
const router = express.Router();
const ServiceProviderController = require("../controllers/ServiceProviderController.js");
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const { verifyToken } = require("../middlewares/verifyTokens.js");
const upload = require("../middlewares/multer.js")

router.post("/send-verification-code", ServiceProviderController.sendVerificationCode)
router.post("/login-service-provider", ServiceProviderController.loginServiceProvider)
// admin
router.get("/service-providers", verifyToken, protectedAdmin, ServiceProviderController.getAllServiceProviders)
// admin
router.get("/service-provider-categories/:id", verifyToken, protectedAdmin, ServiceProviderController.getServiceProviderCategoriesById)
// admin
router.get("/get-service-providers-by-city", verifyToken, protectedAdmin, ServiceProviderController.searchServiceProvidersByCity)
// admin
router.get("/get-service-providers-by-name-or-email", verifyToken, protectedAdmin, ServiceProviderController.getServiceProviderByNameOrEmail)
router.post("/service-provider-account-creation", ServiceProviderController.createServiceProviderAccount)
// admin
router.get("/getServiceProviderById/:id", verifyToken, ServiceProviderController.getServiceProviderById)
router.post("/verification-documents/:id", verifyToken, upload.single('file'), ServiceProviderController.uploadVerificationDocument)
router.put("/add-more-category/:id", verifyToken, ServiceProviderController.addMoreCategories)
router.delete("/delete-single-category/:id", verifyToken, ServiceProviderController.deleteSelectedCategory)
router.get("/get-provider-reviews/:providerId", ServiceProviderController.getReviews)
router.post("/add-provider-review/:providerId", ServiceProviderController.addReview)
router.put("/update-provider-profile", verifyToken, ServiceProviderController.updateServiceProviderProfile)
// admin
router.put("/update-provider-status/:providerId", verifyToken, protectedAdmin, ServiceProviderController.updateProviderStatus)
// admin
router.put("/update-account-hold-status/:providerId", verifyToken, protectedAdmin, ServiceProviderController.updateProviderHoldStatus)
router.put("/change-password", verifyToken, ServiceProviderController.updateProviderPassword)
module.exports = router;