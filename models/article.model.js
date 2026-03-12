const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleSchema = new mongoose.Schema({
    title: String,
    article_category_id: { type: String, default: ""},
    media: String,
    description: String,
    content: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title" , unique: true},
    createdBy: { account_id: String, createdAt: { type: Date, default: Date.now} },
    deleted: { type: Boolean, default: false },
    deletedBy: { account_id: String, deletedAt: Date },
    updatedBy: [{ account_id: String, updatedAt: Date }]
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema, "articles");

module.exports = Article;