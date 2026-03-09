const Article = require("../../models/article.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");


// [GET] /admin/articles
module.exports.index = async (req, res) => {
    let find = ({
        deleted: false
    });

    // Find status
    if (req.query.status) {
        find.status = req.query.status;
    }
    // End find status

    // Filter status
    const filterStatus = filterStatusHelpers(req.query);
    // End filter status

    // Search key word
    const search = searchHelpers(req.query);
    if (search.regex) {
        find.title = search.regex;
    }
    // End search key word

    // Pagination
    const countArticles = await Article.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            limitItems: 4,
            currentPage: 1
        },
        req.query,
        countArticles
    );
    // End pagination

    // Sort
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End sort

    const records = await Article.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

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

    res.render("admin/pages/articles/index", {
        pageTitle: "Danh sách bài viết",
        records: records,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: objectPagination
    });
}


// [PATCH] /admin/articles/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    await Article.updateOne({ _id: id }, { 
        status: status,
        $push: { updatedBy: updatedBy }
    });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.headers.referer);
}


// [PATCH] /admin/articles/changeMulti
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    switch(type){
        case "active":
            await Article.updateMany({ _id: { $in : ids }}, { 
                status:  "active",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "inactive": 
            await Article.updateMany({ _id: { $in : ids }}, { 
                status:  "inactive", 
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "delete-all": 
            await Article.updateMany({ _id: { $in : ids }}, { deleted: true , deletedBy:{ account_id : res.locals.user.id, deletedAt: new Date()}});
            req.flash("success", "Xóa sản phẩm thành công!");
            break;
        case "change-position": 
            for (const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Article.updateOne({ _id: id }, { 
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
}


// [DELETE] /admin/articles/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({ _id: id });
    await Article.updateOne({ _id: id }, { 
        deleted: true , 
        // deletedBy:{ account_id : res.locals.user.id, deletedAt: new Date()}
    });

    req.flash("success", "Đã xóa thành công bài viết");
    res.redirect(req.headers.referer);
}


// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/articles/create", {
        pageTitle: "Tạo mới bài viết"
    });
}


// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
        const countArticles = await Article.countDocuments();
        req.body.position = countArticles + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const record = new Article(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}


// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const article = await Article.findOne(find);
        // const category = await ProductCategory.find({ deleted: false });
        // const newCategory = createTreeHelpers.Tree(category);

        res.render("admin/pages/articles/edit", {
            pageTitle: "Chỉnh sửa bài viết",
            article: article,
            // category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
}


// [PATCH] /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Article.updateOne({ _id: id }, { 
            ...req.body, 
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("errol", "Cập nhật thất bại!");
    }
    res.redirect(req.headers.referer);
}


// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const article = await Article.findOne(find);

        res.render("admin/pages/articles/detail", {
            pageTitle: article.title,
            article: article
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
}