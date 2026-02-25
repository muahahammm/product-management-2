module.exports.createPost = (req, res, next) => {
    if(!req.body.fullname) {
        req.flash("errol", "Vui lòng nhập họ tên");
        res.redirect(back);
        return;
    }

    if(!req.body.email) {
        req.flash("errol", "Vui lòng nhập email");
        res.redirect(back);
        return;
    }

    if(!req.body.password) {
        req.flash("errol", "Vui lòng nhập mật khẩu");
        res.redirect(back);
        return;
    }

    next();
}