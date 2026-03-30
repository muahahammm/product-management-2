const SettingGeneral = require("../../models/setting-general.model");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
}


// [PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({});
  
    if(settingGeneral) {
        await SettingGeneral.updateOne({ _id: settingGeneral.id }, req.body);
    } else {
        const records = new SettingGeneral(req.body);
        await records.save();
    }
    
    res.redirect(req.headers.referer);
}