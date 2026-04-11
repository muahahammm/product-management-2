const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const myAccountRoute = require("./my-account.route");
const articleRoute = require("./article.route");
const articleCategoryRoute = require("./article-category.route");
const settingRoute = require("./setting.route");
const userRoute = require("./user.route");
const orderRoute = require("./order.route");
const binRoute = require("./bin.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoute);

    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoute);

    app.use(PATH_ADMIN + "/products-category", authMiddleware.requireAuth, productCategoryRoute);

    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoute);

    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoute);

    app.use(PATH_ADMIN + "/auth", authRoute);

    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoute);

    app.use(PATH_ADMIN + "/articles", authMiddleware.requireAuth, articleRoute);

    app.use(PATH_ADMIN + "/articles-category", authMiddleware.requireAuth, articleCategoryRoute);

    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoute);

    app.use(PATH_ADMIN + "/users", authMiddleware.requireAuth, userRoute);

    app.use(PATH_ADMIN + "/orders", authMiddleware.requireAuth, orderRoute);

    app.use(PATH_ADMIN + "/bins", authMiddleware.requireAuth, binRoute);
};