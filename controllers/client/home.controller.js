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

    const newProductsFeature = productsHelper.priceNewProducts(productsFeature);
    // Kết thúc lấy ra sản phẩm nổi bật

    // Lấy ra sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position : "desc" }).limit(6);

    const newProducts = productsHelper.priceNewProducts(productsNew);
    // Kết thúc lấy ra sản phẩm mới nhất

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeature: newProductsFeature,
        productsNew: newProducts
    });
}