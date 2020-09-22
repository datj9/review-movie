import Link from "next/link";
import dayjs from "dayjs";
import connectDB from "../../setup/connectDB";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.locale("vi");
dayjs.extend(relativeTime);

export default function News(props) {
    const newsList = JSON.parse(props.newsList);

    return (
        <div className='py-5 mb-6 px-4 news-container'>
            <div className='list-news'>
                {newsList.map((news) => (
                    <Link href={`/news/${news._id}`} key={news._id}>
                        <a className='news-item has-background-white pb-3 mb-6'>
                            <div className='news-img-wp'>
                                <img src={news.image} />
                            </div>
                            <h3 className='news-title has-text-black is-size-5 has-text-weight-bold mx-3'>
                                {news.title}
                            </h3>
                            <div className='mx-3'>
                                <span className='has-text-black'>
                                    {Date.now() - new Date(news.createdAt).getTime() >= 31 * 24 * 60 * 60 * 1000
                                        ? dayjs(news.createdAt).format("DD/MM/YYYY")
                                        : dayjs(news.createdAt).fromNow()}
                                </span>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
            <style jsx>
                {`
                    .news-container {
                        background: #eff0eb;
                    }
                    .list-news {
                        display: flex;
                        flex-direction: column;
                    }
                    .news-item {
                        border-radius: 1rem;
                        overflow: hidden;
                    }
                    .news-title {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .news-img-wp {
                        width: 100%;
                    }
                    .news-img-wp img {
                        width: 100%;
                        height: auto;
                    }
                `}
            </style>
        </div>
    );
}

export async function getStaticProps() {
    try {
        const db = await connectDB();
        const newsList = await db
            .collection("news")
            .find()
            .sort([["createdAt", -1]])
            .skip(0)
            .limit(15)
            .toArray();

        return {
            props: { newsList: JSON.stringify(newsList) },
            revalidate: 1,
        };
    } catch (error) {
        return {
            props: { newsList: JSON.stringify([]), revalidate: 1 },
        };
    }
}
