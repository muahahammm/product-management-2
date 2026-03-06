const ProductCategory = require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    const productCategory = await ProductCategory.find({ deleted: false });
    const newProductCategory = createTreeHelper.Tree(productCategory);
    res.locals.layoutProductCategory = newProductCategory
    next();
}