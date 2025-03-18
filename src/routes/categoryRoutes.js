const express = require("express");
const router = express.Router();
const userController = require("../controllers/CategoryControllers");

router.post("/save", userController.saveCategory)
module.exports = router;