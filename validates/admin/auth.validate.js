module.exports.loginPost = async (req, res, next) => {
    if(!req.body.email) {
        req.flash("errol", "Vui lòng nhập email");
        res.redirect(req.headers.referer);
        return;
    }

    if(!req.body.password) {
        req.flash("errol", "Vui lòng nhập mật khẩu");
        res.redirect(req.headers.referer);
        return;
    }

    next();
};