const express = require("express");
const router = express.Router();
const ServiceProviderController = require("../controllers/ServiceProviderController.js");
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const { verifyToken } = require("../middlewares/verifyTokens.js");
const upload = require("../middlewares/multer.js")


router.post("/service-provider-account-creation", ServiceProviderController.createServiceProviderAccount)
router.get("/getServiceProviderById/:id", verifyToken, protectedAdmin, ServiceProviderController.getServiceProviderById)
router.post("/verification-documents/:id", verifyToken,upload.single('file'), ServiceProviderController.uploadVerificationDocument)
module.exports = router;