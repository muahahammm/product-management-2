const express = require("express");
const multer = require('multer');

const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/user.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);

module.exports = router;