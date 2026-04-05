const md5 = require('md5');

module.exports.editPassword = async (user, tokenUser, passwordNow, passwordNew, passwordNewConfrim) => {
    if(!passwordNow || !passwordNew || !passwordNewConfrim) 
        return { success: false, message: "Vui lòng nhập đủ thông tin"};

    passwordNow = md5(passwordNow);
    passwordNew = md5(passwordNew);
    passwordNewConfrim = md5(passwordNewConfrim);

    if(user.password == passwordNow) {
        if(passwordNew == passwordNow) {
            return { success: false, message: "Mật khẩu mới phải khác mật khẩu hiện tại"};
        } else if (passwordNew != passwordNewConfrim) {
            return { success: false, message: "Xác nhận mật khẩu không đúng"};
        } else {
            return { success: true, message: ""};
        }            
    } else {
        return { success: false, message: "Mật khẩu hiện tại không đúng"};
    }
}