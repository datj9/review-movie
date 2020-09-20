const { News } = require("../../../models/News");
const isInt = require("validator/lib/isInt");
const ObjectId = require("mongoose").Schema.Types.ObjectId;

const getNews = async (req, res) => {
    const { pageSize, pageIndex } = req.query;
    const limit = isInt(pageSize + "") && +pageSize >= 1 ? +pageSize : 10;
    const skip = isInt(pageIndex + "") && +pageIndex >= 1 ? (+pageIndex - 1) * limit : 0 * limit;

    try {
        const listNews = await News.find().skip(skip).limit(limit);
        const total = await News.countDocuments();

        listNews.forEach((n, i) => (listNews[i] = n.transform()));

        return res.status(200).json({ listNews, total });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createNews = async (req, res) => {
    const { title, content, author } = req.body;
    const errors = {};

    if (typeof title != "string") errors.title = "title is invalid";
    if (typeof content != "string") errors.content = "content is invalid";
    if (typeof author != "string" || !ObjectId.isValid(author)) errors.author = "author is invalid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const news = new News({
            title,
            author,
            content,
        });

        await news.save();

        return res.status(200).json(news.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports = { getNews, createNews };
