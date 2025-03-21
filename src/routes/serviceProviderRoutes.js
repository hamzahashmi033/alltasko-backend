const express = require("express");
const router = express.Router();
const ServiceProviderController = require("../controllers/ServiceProviderController.js");
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const { verifyToken } = require("../middlewares/verifyTokens.js");
const upload = require("../middlewares/multer.js")

router.post("/send-verification-code",ServiceProviderController.sendVerificationCode)
router.post("/login-service-provider",ServiceProviderController.loginServiceProvider)
// admin
router.get("/service-providers",verifyToken,protectedAdmin,ServiceProviderController.getAllServiceProviders)
// admin
router.get("/service-provider-categories/:id",verifyToken,protectedAdmin,ServiceProviderController.getServiceProviderCategoriesById)
// admin
router.get("/get-service-providers-by-city",verifyToken,protectedAdmin,ServiceProviderController.searchServiceProvidersByCity)
// admin
router.get("/get-service-providers-by-name-or-email",verifyToken,protectedAdmin,ServiceProviderController.getServiceProviderByNameOrEmail)
router.post("/service-provider-account-creation", ServiceProviderController.createServiceProviderAccount)
// admin
router.get("/getServiceProviderById/:id", verifyToken, ServiceProviderController.getServiceProviderById)
router.post("/verification-documents/:id", verifyToken,upload.single('file'), ServiceProviderController.uploadVerificationDocument)
router.put("/add-more-category/:id",verifyToken,ServiceProviderController.addMoreCategories)
router.delete("/delete-single-category",verifyToken,ServiceProviderController.deleteSelectedCategory)
module.exports = router;