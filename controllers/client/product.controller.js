const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/product-category.model.js");

const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category.js");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});
    
    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sách các sản phẩm",
        products: newProducts
    });
}


// [GET] /products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false, 
            slug: req.params.slug,
            status: "active"
        }

        const product = await Product.findOne(find);

        res.render("client/pages/products/detail.pug", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        
    }
}


// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory, 
        deleted: false,
        status: "active"
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);
    
    const products = await Product.find({
        product_category_id: { $in : [category.id, ...listSubCategoryId ]},
        deleted: false
    }).sort({ position : "desc" });
    
    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        products: newProducts
    });
}