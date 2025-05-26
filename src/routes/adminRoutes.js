const AdminController = require("../controllers/adminControllers")
const express = require("express")

const router = express.Router()


router.get("/getTotalAmount",AdminController.getTotalCompletedPayments)
router.get("/getTotalAmountWithDetails",AdminController.getCompletedPaymentsWithDetails)
router.get("/getServiceRequestTotalCount",AdminController.getServiceRequestCounts)
router.get("/getAllServiceRequest",AdminController.getAllServiceRequests)
router.delete("/deleteServiceRequest/:id",AdminController.deleteServiceRequest)
router.get("/getAllUsers",AdminController.getAllUsers)
router.delete("/deleteUser/:id",AdminController.deleteUser)
router.get("/getAllProfessionals",AdminController.getAllProfessionals)
router.delete("/deleteProfessional/:id",AdminController.deleteProfessional)
router.put("/updateVerificationStatus/:id",AdminController.updateVerificationStatus)
router.put("/updateAccountStatus/:id",AdminController.updateAccountStatus)


module.exports = router