const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeature = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(1);

    const newProducts = productsHelper.priceNewProducts(productsFeature);
    // Kết thúc lấy ra sản phẩm nổi bật

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeature: newProducts
    });
}