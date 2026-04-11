const Order = require("../../models/order.model");
const Product = require("../../models/product.model");


// [GET] /admin/orders
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    } 

    const orders = await Order.find(find);
    
    res.render("admin/pages/orders/index", {
        pageTitle: "Quản lý đơn hàng",
        orders: orders
    });
};


// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    const order = await Order.findOne({
        deleted: false ,
        _id: req.params.id
    });

    const productIds = order.products.map(item => item.product_id);

    const products = await Product.find({
        _id: { $in: productIds }
    });

    res.render("admin/pages/orders/detail", {
        pageTitle: "Quản lý đơn hàng",
        order: order,
        products: products
    });
};