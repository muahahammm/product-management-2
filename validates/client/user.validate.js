module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullname) {
        req.flash("errol", "Vui lòng nhập họ tên");
        res.redirect(req.headers.referer);
        return;
    }

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
}


module.exports.loginPost = (req, res, next) => {
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
}


module.exports.forgotPasswordPost = (req, res, next) => {
    if(!req.body.email) {
        req.flash("errol", "Vui lòng nhập email");
        res.redirect(req.headers.referer);
        return;
    }
    
    next();
}


module.exports.resetPasswordPost = (req, res, next) => {
    if(!req.body.password) {
        req.flash("errol", "Vui lòng nhập mật khẩu");
        res.redirect(req.headers.referer);
        return;
    }

    if(!req.body.confirmPassword) {
        req.flash("errol", "Vui lòng xác nhận mật khẩu");
        res.redirect(req.headers.referer);
        return;
    }

    if(req.body.password != req.body.confirmPassword) {
        req.flash("errol", "Mật khẩu không hợp lệ");
        res.redirect(req.headers.referer);
        return;
    }
    
    next();
}