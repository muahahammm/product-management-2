const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");


// [GET] /carts/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0) {
        for(const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage");

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
};


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


// [GET] /carts/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId }}
    });
    req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
    res.redirect(req.headers.referer);
};