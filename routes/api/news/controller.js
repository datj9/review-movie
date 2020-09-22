const { News } = require("../../../models/News");
const isInt = require("validator/lib/isInt");
const isURL = require("validator/lib/isURL");
const ObjectId = require("mongoose").Types.ObjectId;

const getNews = async (req, res) => {
    const { pageSize, pageIndex } = req.query;
    const limit = isInt(pageSize + "") && +pageSize >= 1 ? +pageSize : 10;
    const skip = isInt(pageIndex + "") && +pageIndex >= 1 ? (+pageIndex - 1) * limit : 0 * limit;

    try {
        const listNews = await News.find().skip(skip).limit(limit).populate("author", "name");
        const total = await News.countDocuments();

        listNews.forEach((n, i) => {
            listNews[i] = n.transform();
            listNews[i].author.id = listNews[i].author._id;
            delete listNews[i].author._id;
        });

        return res.status(200).json({ listNews, total });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getNewsById = async (req, res) => {
    const { newsId } = req.params;

    if (!ObjectId.isValid(newsId + "")) return { newsId: "newsId is invadlid" };

    try {
        const news = await News.findById(newsId).populate("author", "name");

        if (!news) return res.status(404).json({ error: "News not found" });

        news.author.id = news.author._id;
        delete news.author._id;
        delete news.author.__v;

        return res.status(200).json(news);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const createNews = async (req, res) => {
    const { title, content, image } = req.body;
    const { id: userId } = req.user;
    const errors = {};

    if (typeof title != "string") errors.title = "title is invalid";
    if (typeof content != "string") errors.content = "content is invalid";
    if (!isURL(image + "")) errors.image = "image is not URL";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const news = new News({
            title,
            content,
            image,
            author: userId,
        });

        await news.save();

        return res.status(200).json(news.transform());
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateNews = async (req, res) => {
    const { newsId } = req.params;
    const { title, content, image } = req.body;
    const errors = {};

    if (typeof title != "string") errors.title = "title is invalid";
    if (typeof content != "string") errors.content = "content is invalid";
    if (!isURL(image + "")) errors.image = "image is not URL";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        await News.updateOne({ _id: newsId }, { title, content, image });

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        return res.status(500).json({ ...error, isSuccess: false });
    }
};

const changePublicStatus = async (req, res) => {
    const { isPublic } = req.query;
    const { newsId } = req.params;
    const errors = {};

    if (typeof isPublic != "boolean") errors.isPublic = "isPublic is invalid";
    if (!ObjectId.isValid(newsId + "")) errors.newsId = "newsId is invadlid";
    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        await News.updateOne({ _id: newsId }, { isPublic });

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        return res.status(500).json({ ...error, isSuccess: false });
    }
};

const deleteNewsById = async (req, res) => {
    const { newsId } = req.params;

    if (!ObjectId.isValid(newsId + "")) return { newsId: "newsId is invadlid" };

    try {
        await News.deleteOne({ _id: newsId });

        return res.status(200).json({ isSuccess: true });
    } catch (error) {
        return res.status(500).json({ ...error, isSuccess: false });
    }
};

module.exports = { getNews, getNewsById, createNews, updateNews, changePublicStatus, deleteNewsById };
