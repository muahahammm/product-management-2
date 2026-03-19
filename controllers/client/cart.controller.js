const Cart = require("../../models/cart.model");

// [POST] /carts/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    let cartId = req.cookies.cartId;

    let cart = await Cart.findOne({ _id: cartId });

    // Nếu chưa có cart tạo mới
    if (!cart) {
        cart = new Cart({
            products: []
        });

        await cart.save();
        cartId = cart.id;

        res.cookie("cartId", cartId);
    }

    // Kiểm tra sản phẩm đã có chưa
    const existProductCart = cart.products.find(
        item => item.product_id == productId
    );

    if (existProductCart) {
        // update quantity
        await Cart.updateOne(
            { _id: cartId, "products.product_id": productId},
            { $inc: { "products.$.quantity": quantity } }
        );
    } else {
        // thêm mới sản phẩm
        await Cart.updateOne(
            { _id: cartId },
            { $push: { products: { product_id: productId, quantity: quantity } } }
        );
    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    res.redirect(req.headers.referer);
};