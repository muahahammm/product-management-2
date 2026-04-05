const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const md5 = require("md5");

const generateHelper = require("../../helpers/generate");
const sendEmailHelper = require("../../helpers/sendEmail");


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

    const cart = await Cart.findOne({
        user_id: user.id
    });

    if(cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        });
    }

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
}


// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
}


// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu"
    });
}


// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        req.flash("errol", "Email không tồn tại");
        res.redirect(req.headers.referer);
        return;
    }

    // Lưu thông tin mã otp vào DB 
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    // Kết thúc lưu thông tin mã otp vào DB

    // Gửi mã otp qua email
    const subject = "Mã otp xác minh lấy lại mật khẩu";
    const html = `Mã otp của bạn là <b style="color:green;">${otp}</b>. Mã hết hạn sau 2 phút`;

    await sendEmailHelper.sendEmail(email, subject, html);
    console.log("Gửi mã otp qua email", otp);
    res.redirect(`/user/password/otp?email=${email}`);
    // Kết thúc gửi mã otp qua email
}


// [GET] /user/password/forgot
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    
    res.render("client/pages/user/otp-password.pug", {
        pageTitle: "Nhập mã otp",
        email: email
    });
}


// [POST] /user/password/forgot
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    const user = await User.findOne({
        email: email
    });

    if(!result) {
        req.flash("errol", "Mã otp không tồn tại");
        res.redirect(req.headers.referer);
        return;
    }

    res.cookie("tokeunUser", user.tokenUser);

    res.redirect("/user/password/reset");
}


// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password.pug", {
        pageTitle: "Cập nhật mật khẩu",
    });
}


// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    });

    res.send("OK");
}


// [GET] /user/info
module.exports.info = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const infoUser = await User.findOne({
        tokenUser: tokenUser
    }).select("-password");

    res.render("client/pages/user/info.pug", {
        pageTitle: "Thông tin tài khoản",
        infoUser: infoUser
    });
}


// [GET] /user/info/edit
module.exports.edit = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const infoUser = await User.findOne({
        tokenUser: tokenUser
    }).select("-password");

    res.render("client/pages/user/edit.pug", {
        pageTitle: "Chỉnh sửa thông tin tài khoản",
        infoUser: infoUser
    });
}


// [POSt] /user/info/edit
module.exports.editPost = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const email = req.body.email;

    const findEmail = await User.findOne({
        email: email
    });

    try {
        // Trường hợp đổi email
        if(!findEmail) {
            await User.updateOne({
                tokenUser: tokenUser
            }, req.body);
        }

        // Trường hợp giữ nguyên email
        await User.updateOne({
            tokenUser: tokenUser
        }, {
            fullname: req.body.fullname 
        });

        req.flash("success", "Cập nhật thông tin thành công");
    } catch (error) {
        req.flash("errol", "Cập nhật thông tin thất bại");
    }

    res.redirect(req.headers.referer);
}