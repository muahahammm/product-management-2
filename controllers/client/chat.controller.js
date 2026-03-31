const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.chat = async (req, res) => {
    const userId = res.locals.user.id;
    const fullname = res.locals.user.fullname;

    // Socket.io
    _io.once('connection', (socket) => {
        socket.on('CLIENT_SEND_MESSAGE', async (content) => {
            // Lưu vào database
            const chat = new Chat({
                user_id: userId,
                content: content
            });
            await chat.save();
            // Kết thúc lưu vào database 

            // Trả data về client 
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullname: fullname, 
                content: content
            });
            // Kết thúc trả data về client
        });
    });
    // End socket.io

    // Lấy data từ database
    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullname");

        chat.infoUser = infoUser;
    }
    // Kết thúc lấy data từ database

    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats
    });
};