const express = require("express");
const router = express.Router();
const LeadGeneration = require("../controllers/LeadGenerationControllers.js")
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const serviceUpload = require("../middlewares/serviceUpload.js")

const { verifyToken } = require("../middlewares/verifyTokens.js");

router.get("/getFormConfig/:serviceType", LeadGeneration.getFormConfig)

router.post("/createLead", serviceUpload.array('photos', 5), LeadGeneration.createRequest)
router.post("/pic", serviceUpload.array('photos', 5), LeadGeneration.picRequest)
router.get("/getUserRequest", verifyToken, LeadGeneration.getUserRequests)
router.get("/getRequest/:id", LeadGeneration.getRequest)

router.put("/assignProvider/:requestId/:providerId", LeadGeneration.assignProvider)

router.delete("/deleteRequest/:id", LeadGeneration.deleteRequest)



// professional panel
router.get("/get-subsubcategories-of-provider/:providerId", LeadGeneration.getProviderSubSubCategories)
router.get("/get-subsubcategories-leads-of-provider/:providerId", LeadGeneration.getLeadCountsBySubSubCategory)
router.get("/get-all-matching-leads-of-provider/:providerId",LeadGeneration.getAllMatchingLeads)

module.exports = router