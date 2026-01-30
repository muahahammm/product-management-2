const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelpers(req.query);

    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    const search = searchHelpers(req.query);
    if (search.regex) {
        find.title = search.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);
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
    }
    else {
        sort.posotion = "desc";
    }
    // End sort

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: objectPagination
    });
};


// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    await Product.updateOne({ _id: id }, { status });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.headers.referer || "/admin/products");
};


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    
    switch(type){
        case "active":
            await Product.updateMany({ _id: { $in : ids }}, { status:  "active" });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "inactive": 
            await Product.updateMany({ _id: { $in : ids }}, { status:  "inactive" });
            req.flash("success", "Cập nhật trạng thái thành công!");
            break;
        case "delete-all": 
            await Product.updateMany({ _id: { $in : ids }}, { deleted:  "true" , deleteAt: new Date() });
            req.flash("success", "Xóa sản phẩm thành công!");
            break;
        case "change-position": 
            for (const item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
                req.flash("success", "Cập nhật vị trí thành công!");
            }
            break;
        default: 
            break;
    }

    res.redirect(req.headers.referer || "/admin/products");
};


// [DELETE] /admin/products/deleted/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, { deleted: true , deleteAt: new Date()});

    res.redirect(req.headers.referer || "/admin/products");
};


// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
};


// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};


// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};


// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);
    

    if(req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: id}, req.body);
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("errol", "Cập nhật thất bại!");
    }
    res.redirect(req.headers.referer || "/admin/products");
};


// [GET] /admin/products/detail
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};