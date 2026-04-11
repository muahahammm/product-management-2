const express = require("express");
const multer = require('multer');

const router = express.Router();
const upload = multer();

const controller = require("../../controllers/admin/order.controller");
const validate = require("../../validates/admin/product-category.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

module.exports = router;