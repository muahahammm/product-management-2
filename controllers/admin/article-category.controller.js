const ArticleCategory = require("../../models/article-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const createTreeHelpers = require("../../helpers/createTree");
const searchHelpers = require("../../helpers/search");


// [GET] /admin/articles-category
module.exports.index = async (req, res) => {
    const find = ({
        deleted: false
    });

    // Find status
    if (req.query.status) {
        find.status = req.query.status;
    }
    // End find status

    // Search key word
    const search = searchHelpers(req.query);

    if (search.regex) {
        find.title = search.regex;
    }
    // End search key word

    const records = await ArticleCategory.find(find);
    const newRecord = createTreeHelpers.Tree(records);

    for (const record of records) {
        // Lấy thông tin người tạo
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        });

        if(user) {
            record.createdBy.accountFullName = user.fullname;
        }
        // Kết thúc lấy thông tin người tạo

        // Lấy ra thông tin người cập nhật gần nhất
        const updatedBy = record.updatedBy[record.updatedBy.length - 1];
        if(updatedBy) {
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdated.fullname;
        }
        // Kết thúc lấy ra thông tin người cập nhật gần nhất
    }

    res.render("admin/pages/articles-category/index", {
        pageTitle: "Danh mục bài viết",
        record: newRecord,
        keyword: search.keyword
    });
};


// [PATCH] /admin/articles-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ArticleCategory.updateOne({ _id: id }, { 
        status,
        $push: { updatedBy: updatedBy } 
    });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.headers.referer);
};


// [PATCH] /admin/articles-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await ArticleCategory.updateMany({ _id: { $in: ids } }, { 
                status: "active",
                $push: { updatedBy: updatedBy } 
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "inactive":
            await ArticleCategory.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
                $push: { updatedBy: updatedBy } 
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "delete-all":
            await ArticleCategory.updateMany({ _id: { $in: ids } }, { deleted: "true", deleteAt: new Date() });
            req.flash("success", "Xóa sản phẩm thành công!");
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await ArticleCategory.updateOne({ _id: id }, { 
                    position: position,
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", "Cập nhật vị trí thành công!");
            }
            break;
        default:
            break;
    }

    res.redirect(req.headers.referer);
};


// [DELETE] /admin/articles-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ArticleCategory.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
    res.redirect(req.headers.referer);
};


// [CREATE] /admin/articles-category/create
module.exports.create = async (req, res) => {
    let find = ({
        deleted: false
    });

    const articleCategory = await ArticleCategory.find(find);
    const newArticleCategory = createTreeHelpers.Tree(articleCategory);

    res.render("admin/pages/articles-category/create", {
        pageTitle: "Danh mục bài viết",
        article: newArticleCategory
    });
};


// [POST] /admin/articles-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countArticles = await ArticleCategory.countDocuments();
        req.body.position = countArticles + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const record = new ArticleCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
};


// [GET] /admin/articles-category/edit/:id
module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };

    const articleCategory = await ArticleCategory.findOne(find);
    const record = await ArticleCategory.find({deleted: false});
    const newRecord = createTreeHelpers.Tree(record);

    res.render("admin/pages/articles-category/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        article: articleCategory,
        records: newRecord
    });
};


// [PATCH] /admin/articles-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    if (req.file) {
        req.body.media = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await ArticleCategory.updateOne({ _id: id }, { 
            ...req.body, 
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("errol", "Cập nhật thất bại!");
    }
    res.redirect(req.headers.referer);
};


// [GET] /admin/articles-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const articleCategory = await ArticleCategory.findOne(find);

        res.render("admin/pages/articles-category/detail", {
            pageTitle: articleCategory.title,
            article: articleCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
    }
};