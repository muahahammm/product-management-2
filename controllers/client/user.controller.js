const User = require("../../models/user.model");
const md5 = require("md5");


// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký tài khoản"
    });
}


// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const emailExist = await User.findOne({
        email: req.body.email
    });

    if(emailExist) {
        req.flash("errol", "Email này đã tồn tại");
        res.redirect(req.headers.referer);
        return;
    }

    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);
    
    res.redirect("/");
}


// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập tài khoản"
    });
}


// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        status: "active"    
    });

    if(!user) {
        req.flash("errol", "Email không tồn tại");
        res.redirect(req.headers.referer);
        return;
    }

    if(md5(password) != user.password) {
        req.flash("errol", "Sai mật khẩu");
        res.redirect(req.headers.referer);
        return;
    }

    if(user.status == "inactive") {
        req.flash("errol", "Tài khoản bị khóa hoặc không còn hoạt động");
        res.redirect(req.headers.referer);
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}


// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}