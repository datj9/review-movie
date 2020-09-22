import { useRouter } from "next/router";
import connectDB from "../../setup/connectDB";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

function NewsDetail(props) {
    const news = props.news ? JSON.parse(props.news) : {};
    const { isFallback } = useRouter();

    if (isFallback) return <div>Loading ....</div>;
    return (
        <div className='py-5 mb-6 px-3 news-page'>
            <div className='news-title is-size-3 has-text-black has-text-weight-bold'>{news.title}</div>
            <div className='is-flex time-and-author'>
                <span>{dayjs(news.createdAt).format("DD/MM/YYYY")}</span>
                <span>{news.author.name}</span>
            </div>
            <style>
                {`
                    .time-and-author {
                        justify-content: space-between;
                    }
                `}
            </style>
        </div>
    );
}

export async function getStaticPaths() {
    try {
        const db = await connectDB();
        const newsList = await db.collection("news").find().toArray();
        const paths = newsList.map((news) => `/news/${news._id}`);

        return { paths, fallback: true };
    } catch (error) {
        return { paths: [] };
    }
}

export async function getStaticProps({ params: { newsId } }) {
    try {
        const db = await connectDB();
        const news = await db.collection("news").findOne({ _id: ObjectId(newsId) });
        const author = await db.collection("users").findOne({ _id: ObjectId(news.author) });

        news.author = author;

        return { props: { news: JSON.stringify(news) }, revalidate: 1 };
    } catch (error) {
        return { props: { news: JSON.stringify({}) }, revalidate: 1, };
    }
}

export default NewsDetail;
