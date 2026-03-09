const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const createTreeHelpers = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    // Filter status
    const filterStatus = filterStatusHelpers(req.query);
    // End filter status

    let find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Search key word
    const search = searchHelpers(req.query);

    if (search.regex) {
        find.title = search.regex;
    }
    // End search key word

    // Pagination
    const countProducts = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            limitItems: 4,
            currentPage: 1
        },
        req.query,
        countProducts
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

    const records = await ProductCategory.find(find)
        // .sort(sort)
        // .limit(objectPagination.limitItems)
        // .skip(objectPagination.skip);
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

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecord,
        keyword: search.keyword,
        filterStatus: filterStatus,
    });
};


// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    await ProductCategory.updateOne({ _id: id }, { 
        status,
        $push: { updatedBy: updatedBy } 
    });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.headers.referer || "/admin/products-category");
};


// [PATCH] /admin/products-category/change-multi 
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { 
                status: "active",
                $push: { updatedBy: updatedBy } 
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { 
                status: "inactive",
                $push: { updatedBy: updatedBy } 
            });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: "true", deleteAt: new Date() });
            req.flash("success", "Xóa sản phẩm thành công!");
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await ProductCategory.updateOne({ _id: id }, { 
                    position: position,
                    $push: { updatedBy: updatedBy }
                });
                req.flash("success", "Cập nhật vị trí thành công!");
            }
            break;
        default:
            break;
    }

    res.redirect(req.headers.referer || "/admin/products-category");
};


// [DELETE] /admin/products-category/delete/:id 
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
    res.redirect(req.headers.referer || "/admin/products-category");
};


// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const productCategory = await ProductCategory.find(find);
    const newProDuctCategory = createTreeHelpers.Tree(productCategory);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        product: newProDuctCategory
    });
};


// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};


// [GET] /admin/products-category/edit
module.exports.edit = async (req, res) => {
    const find = {
        deleted: false,
        _id: req.params.id
    };

    const productCategory = await ProductCategory.findOne(find);
    const record = await ProductCategory.find({deleted: false});
    const newRecord = createTreeHelpers.Tree(record);

    res.render("admin/pages/products-category/edit", {
        pageTitle: "Chỉnh sửa sản phẩm",
        product: productCategory,
        records: newRecord
    });
};


// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);


    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await ProductCategory.updateOne({ _id: id }, { 
            ...req.body, 
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("errol", "Cập nhật thất bại!");
    }
    res.redirect(req.headers.referer || "/admin/products-category");
};


// [GET] /admin/products-category/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const productCategory = await ProductCategory.findOne(find);

        res.render("admin/pages/products-category/detail", {
            pageTitle: productCategory.title,
            product: productCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};