const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    tokenUser: { 
        type: String, 
        default: generate.generateRandomString(20) 
    },
    phone: String,
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    requestFriend: Array, // Lời mời đã gửi
    acceptFriend: Array, // Lời mời đã nhận
    friendList: [ // Danh sách bạn bè
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    deleted: { 
        type: Boolean, 
        default: false 
    },
    deleteAt: Date,
    updatedBy: [{
        account_id: String,
        updatedAt: Date
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema, "users");

module.exports = User;