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


module.exports.editPost = (req, res, next) => {
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

    // if(!req.body.password) {
    //     req.flash("errol", "Vui lòng nhập mật khẩu");
    //     res.redirect(req.headers.referer);
    //     return;
    // }

    // if(!req.body.newPassword) {
    //     req.flash("errol", "Vui lòng nhập mật khẩu mới");
    //     res.redirect(req.headers.referer);
    //     return;
    // }

    // if(!req.body.confirmNewPassword) {
    //     req.flash("errol", "Vui lòng xác nhận mật khẩu");
    //     res.redirect(req.headers.referer);
    //     return;
    // }

    if(req.body.password) {
        if(!req.body.newPassword) {
            req.flash("errol", "Vui lòng nhập mật khẩu mới");
            res.redirect(req.headers.referer);
            return;
        }

        if(!req.body.confirmNewPassword) {
            req.flash("errol", "Vui lòng xác nhận mật khẩu");
            res.redirect(req.headers.referer);
            return;
        }
        
        if(req.body.password == req.body.newPassword) {
            req.flash("errol", "Mật khẩu mới phải khác mật khẩu hiện tại");
            res.redirect(req.headers.referer);
            return;
        }

        if(req.body.confirmNewPassword != req.body.newPassword) {
            req.flash("errol", "Xác nhận mật khẩu không đúng");
            res.redirect(req.headers.referer);
            return;
        }
    }
    
    next();
}