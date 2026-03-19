const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    let cartId = req.cookies.cartId;
    let cart = null;

    // 1. Nếu có cookie → tìm cart
    if (cartId) {
        cart = await Cart.findOne({ _id: cartId });
    }

    // 2. Nếu không có cart (cookie sai hoặc chưa có)
    if (!cart) {
        cart = new Cart({
            products: []
        });

        await cart.save();

        cartId = cart.id;

        const expireTime = 7 * 24 * 60 * 60 * 1000;
        res.cookie("cartId", cartId, {
            expires: new Date(Date.now() + expireTime)
        });
    }

    // 3. Đảm bảo products luôn hợp lệ
    cart.products = cart.products || [];

    // 4. Tính tổng số lượng
    cart.totalQuantity = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    // 5. Gắn vào locals để view dùng
    res.locals.miniCart = cart;

    next();
};