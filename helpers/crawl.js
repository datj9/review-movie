const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://moveek.com";
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const { Movie } = require("../models/Movie");

dayjs.extend(customParseFormat);

async function fetchData(url) {
    let response = await axios(url).catch((err) => console.log(err));

    if (response.status !== 200) {
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

module.exports.crawlMovies = async function (movieStatus) {
    const res = await fetchData(`${url}/${movieStatus}`);
    const html = res.data;
    const $ = cheerio.load(html);
    const movieLinks = $(".card.card-xs.mb-4 > a");
    const fetchingMoviesList = [];

    movieLinks.each(function () {
        const href = !$(this).attr("href").startsWith("/mua-ve/")
            ? $(this).attr("href")
            : $(this).attr("href").replace("mua-ve", "phim");
        const movieURL = `${url}${href}`;
        fetchingMoviesList.push(fetchData(movieURL));
    });

    const resList = await Promise.all(fetchingMoviesList);
    const moviesData = resList.map((res) => {
        const htmlOfMovie = res.data;
        const $1 = cheerio.load(htmlOfMovie);
        const actorsAndDirectors = $1("p.mb-2");
        const releaseAndTime = $1("div.col.text-center.text-sm-left");
        const youtubeVid = $1(".js-video.youtube");
        const trailer = youtubeVid.find("iframe").attr("src");
        const name = $1("h1").find("a").attr("title");
        const description = $1(".col-12.col-lg-7").find("p").text();
        const image = $1(".d-none.d-sm-block.col-2").find("img").attr("data-src");
        const actors = [];
        const filmDirectors = [];
        let runningTime;
        let releaseDate;

        actorsAndDirectors.each(function () {
            const field = $1(this).find("strong").text().trim();

            switch (true) {
                case RegExp("Diễn viên", "i").test(field):
                    const actorNodes = $1(this).find("span a").toArray();
                    actorNodes.forEach((node) => actors.push(node.children[0].data));
                    break;
                case RegExp("Đạo diễn").test(field):
                    const directorNodes = $1(this).find("span a").toArray();
                    directorNodes.forEach((node) => filmDirectors.push(node.children[0].data));
                    break;
                default:
                    break;
            }
        });

        releaseAndTime.each(function () {
            const field = $1(this).find("strong span").text().trim();

            switch (true) {
                case RegExp("Khởi chiếu", "i").test(field):
                    const release = $1(this).find("span").text();
                    const unformattedReleaseDate = release.replace(field, "");
                    releaseDate = new Date(dayjs(unformattedReleaseDate, "DD/MM/YYYY").format("YYYY-MM-DD"));
                    break;
                case RegExp("Thời lượng", "i").test(field):
                    const time = $1(this).find("span").text();
                    runningTime = time.replace(RegExp(`${field}| phút`, "gi"), "");
                default:
                    break;
            }
        });

        return {
            name,
            description,
            image,
            actors,
            filmDirectors,
            releaseDate,
            runningTime,
            trailer,
        };
    });

    const promiseFoundMovies = [];
    let i = 0;
    const moviesDataLength = moviesData.length;
    while (i < Math.ceil(moviesDataLength / 2)) {
        const tem = moviesData[i];
        moviesData[i] = moviesData[moviesDataLength - i - 1];
        moviesData[moviesDataLength - i - 1] = tem;
        i++;
    }
    moviesData.forEach((data) => promiseFoundMovies.push(Movie.findOne({ name: data.name })));
    const foundMovies = await Promise.all(promiseFoundMovies);

    const createdMovies = [];
    foundMovies.forEach((movie, i) => {
        if (!movie) {
            const newMovie = new Movie({
                ...moviesData[i],
                status: movieStatus === "dang-chieu" ? 1 : 0,
            });
            createdMovies.push(newMovie.save());
        }
    });
    await Promise.all(createdMovies);

    return createdMovies;
};
