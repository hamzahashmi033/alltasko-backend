const express = require("express");
const router = express.Router();
const LeadGeneration = require("../controllers/LeadGenerationControllers.js")
const { protectedAdmin } = require("../middlewares/protectedAdmin.js");
const serviceUpload = require("../middlewares/serviceUpload.js")

router.get("/getFormConfig/:serviceType", LeadGeneration.getFormConfig)

router.post("/createLead", serviceUpload.array('photos', 5), LeadGeneration.createRequest)

router.get("/getRequest/:id", LeadGeneration.getRequest)

router.put("/assignProvider/:requestId/:providerId", LeadGeneration.assignProvider)

router.delete("/deleteRequest/:id", LeadGeneration.deleteRequest)

module.exports = router