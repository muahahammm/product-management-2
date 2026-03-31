// [GET] /chat/
module.exports.chat = async (req, res) => {
    // Socket.io
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });
    // End socket.io

    res.render("client/pages/chat/index", {
        pageTitle: "Chat"
    })
};