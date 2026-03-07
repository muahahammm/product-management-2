const Role = require("../../models/role.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);

    for(const record of records) {
        // Lấy thông tin người đọc
        const user = await Account.findOne({
            _id: record.createdBy.account_id 
        });

        if(user) {
            record.createdBy.accountFullName = user.fullname;
        }
        // Kết thúc lấy thông tin người đọc

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

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
};


// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true });
    res.redirect(req.headers.referer);
};


// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tạo nhóm quyền",
    });
};


// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};


// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
            deleted: false
        }

        const data = await Role.findOne(find);

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};


// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Role.updateOne({ _id: id }, { 
            ...req.body, 
            $push: { updatedBy: updatedBy }
        });
        req.flash("success", "Cập nhật thành công!");
    } catch (error) {
        req.flash("errol", "Cập nhật thất bại!");
    }
    res.redirect(req.headers.referer || "/admin/roles");
};


// [GET] /admin/roles/permisions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
};


// [PATCH] /admin/roles/permisions
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật thành công!");
    res.redirect(req.headers.referer || "/admin/roles/permissions");

};