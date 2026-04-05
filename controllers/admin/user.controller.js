const User = require("../../models/user.model");
const Account = require("../../models/account.model");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");


// [GET] /admin/users
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    } 

    const status = req.query.status?.trim();

    if (status && status !== "all") {
        find.status = status;
    }

    // Bộ lọc và tìm kiếm
    const filterStatus = filterStatusHelpers(req.query);
    // Kết thúc bộ lọc và tìm kiếm

    // Search key word
    const search = searchHelpers(req.query);

    if (search.regex) {
        find.$or = [
            { fullname: search.regex },
            { email: search.regex }
        ];
    }
    // End search key word

    // Pagination
    const countUser = await User.countDocuments(find);
    let objectPagination = paginationHelpers(
        {
            limitItems: 4,
            currentPage: 1
        },
        req.query,
        countUser
    );
    // End pagination

    // Sort
    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }
    // End sort

    const users = await User.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const user of users) {
        // Lấy ra người cập nhật gần nhất
        const updatedBy = user.updatedBy[user.updatedBy.length - 1];
        if(updatedBy) {
            const userUpdate = await Account.findOne({
                _id: updatedBy.account_id
            });
            updatedBy.accountFullName = userUpdate.fullname;
        }
        // Kết thúc lấy ra người cập nhật gần nhất
    }

    res.render("admin/pages/users/index.pug", {
        pageTitle: "Quản lý tài khoản người dùng",
        users: users,
        filterStatus: filterStatus,
        keyword: search.keyword,
        pagination: objectPagination
    });
}


// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const { status, id } = req.params;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await User.updateOne({ _id: id }, {
        status,
        $push: { updatedBy: updatedBy }
    });

    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect(req.headers.referer);
}


// [PATCH] /admin/users/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active": {
            await User.updateMany({
                _id: { $in: ids }
            }, {
                status: "active",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
            break;
        }
        case "inactive": {
            await User.updateMany({
                _id: { $in: ids }
            }, {
                status: "inactive",
                $push: { updatedBy: updatedBy }
            });
            req.flash("success", "Cập nhật trạng thái thành công");
            break;
        }
        case "delete-all": {
            await User.updateMany({
                _id: { $in: ids }
            }, {
                deleted: true
            });
            req.flash("success", "Xóa tài khoản thành công");
            break;
        }
    }

    res.redirect(req.headers.referer);
}