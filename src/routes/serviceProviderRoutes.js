const express = require("express");
const router = express.Router();
const ServiceProviderController = require("../controllers/ServiceProviderController.js");
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const { verifyToken, verifyProviderToken } = require("../middlewares/verifyTokens.js");
const upload = require("../middlewares/multer.js");
const uploadProfilePicture = require("../middlewares/serviceProviderImage.js");
router.get("/verify-route", verifyProviderToken, (req, res) => {
    res.json({ valid: true });
});

router.get("/service-provider-details", verifyProviderToken, ServiceProviderController.getServiceProviderDetails)
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
router.get("/getServiceProviderById/:id", verifyProviderToken, ServiceProviderController.getServiceProviderById)
router.post("/verification-documents/:id", verifyProviderToken, upload.single('file'), ServiceProviderController.uploadVerificationDocument)
router.put("/add-more-category/:id", verifyProviderToken, ServiceProviderController.addMoreCategories)
router.delete("/delete-single-category/:id", verifyProviderToken, ServiceProviderController.deleteSelectedCategory)
router.get("/get-provider-reviews/:providerId", ServiceProviderController.getReviews)
router.post("/add-provider-review/:providerId", ServiceProviderController.addReview)
router.put("/update-provider-profile", verifyProviderToken, ServiceProviderController.updateServiceProviderProfile)
// admin
router.put("/update-provider-status/:providerId", verifyToken, protectedAdmin, ServiceProviderController.updateProviderStatus)
// admin
router.put("/update-account-hold-status/:providerId", verifyToken, protectedAdmin, ServiceProviderController.updateProviderHoldStatus)
router.put("/change-password", verifyProviderToken, ServiceProviderController.updateProviderPassword)
router.get("/get-available-provider-by-postal-code", ServiceProviderController.getAvailableProviders)
router.post("/forget-password-provider", ServiceProviderController.forgetPassword)
router.post("/reset-password-provider", ServiceProviderController.resetPassword)

router.get("/getProfessionalbyName/:name", ServiceProviderController.getProfessionalProfileByName)

router.post(
    '/upload-profile', verifyProviderToken,
    uploadProfilePicture.single('profilePicture'),
    ServiceProviderController.uploadProfilePicture
);
router.get("/logout", verifyProviderToken, ServiceProviderController.providerLogout)

router.put("/update-activity-status", verifyProviderToken, ServiceProviderController.updateActivityStatus)
module.exports = router;