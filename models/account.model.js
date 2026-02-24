const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    token: { type: String, default: generate.generateRandomString },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: { type: Boolean, default: false },
    deleteAt: Date
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema, "accounts");

module.exports = Account;