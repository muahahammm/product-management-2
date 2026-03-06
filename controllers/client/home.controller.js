const ProductCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /
module.exports.index = async (req, res) => {
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ"
    });
}