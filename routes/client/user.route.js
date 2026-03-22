const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const userValidate = require("../../validates/client/user.validate");

router.get('/register', controller.register);

router.post('/register', userValidate.registerPost ,controller.registerPost);

module.exports = router;