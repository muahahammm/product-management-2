const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const ArticleCategory = require("../../models/article-category.model");
const Article = require("../../models/article.model");


// [get] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        },
        categoryArticle: {
            total: 0,
            active: 0,
            inactive: 0
        },
        article: {
            total: 0,
            active: 0,
            inactive: 0
        },
    }

    const countRecordModelAll = async (Model) => {
        const [total, active, inactive] = await Promise.all([
            Model.countDocuments({
                deleted: false
            }),
            Model.countDocuments({
                deleted: false,
                status: "active"
            }),
            Model.countDocuments({
                deleted: false,
                status: "inactive"
            })
        ]);

        return { total, active, inactive };
    }

    statistic.categoryProduct = await countRecordModelAll(ProductCategory);
    statistic.product = await countRecordModelAll(Product);
    statistic.account = await countRecordModelAll(Account);
    statistic.user = await countRecordModelAll(User);
    statistic.categoryArticle = await countRecordModelAll(ArticleCategory); 

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
};