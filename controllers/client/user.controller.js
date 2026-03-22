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