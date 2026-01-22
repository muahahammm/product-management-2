module.exports.createPost = (req, res, next) => {
    if(!req.body.title){
        req.flash("errol", "Vui lòng nhập tiêu đề!");
        res.redirect("create");
        return;
    }

    next();
}