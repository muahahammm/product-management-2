const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const User = require("../../models/user.model");
const Article = require("../../models/article.model");
const ArticleCategory = require("../../models/article-category.model");

module.exports.index = async (req, res) => {
    const find = {
        deleted: true
    }

    const products = await Product.find(find);

    const productscategory = await ProductCategory.find(find);

    const accounts = await Account.find(find);
    for (const account of accounts) {
        const roles = await Role.findOne({
            _id: account.role_id,
            deleted: false
        });
        account.role = roles;
    }

    const users = await User.find(find);

    const articles = await Article.find(find);

    const articlecategory = await ArticleCategory.find(find);

    const roles = await Role.find(find);

    res.render("admin/pages/bins/index", {
        pageTitle: "Thùng rác",
        products: products,
        productscategory: productscategory,
        accounts: accounts,
        users: users,
        articles: articles,
        articlecategory: articlecategory,
        roles: roles
    });
}