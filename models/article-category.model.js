const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: { type: String, default: ""},
  description: String,
  media: String,
  status: String,
  position: Number,
  slug: { type: String, slug: "title" , unique: true},
  createdBy: { account_id: String, createdAt: { type: Date, default: Date.now} },
  deleted: { type: Boolean, default: false},
  deleteAt: Date,
  updatedBy: [{ account_id: String, updatedAt: Date }]
}, { timestamps: true });

const ArticleCategory = mongoose.model('ArticleCategory', articleCategorySchema, "articles-category");

module.exports = ArticleCategory;