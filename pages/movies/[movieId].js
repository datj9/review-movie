import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import fetch from "isomorphic-unfetch";
import { apiURL } from "../../redux/api";
import { useState } from "react";
// import { withUserServerSideProps, withUser } fro../../HOC/withUserser";

function Movie({ movie }) {
    const [tabActive, setTabActive] = useState(0);

    return (
        <div className='px-3 py-5'>
            <div className='tabs'>
                <ul>
                    {[
                        { name: "Thông tin phim", id: "info" },
                        { name: "Đánh giá", id: "review" },
                    ].map((tab, i) => (
                        <li className={tabActive === i ? "is-active" : ""}>
                            <a onClick={() => setTabActive(i)} href={`#${tab.id}`}>
                                {tab.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            {tabActive === 0 ? (
                <div id='info' className='tab-content ytb-video'>
                    <iframe src={movie.trailer} />
                </div>
            ) : null}

            {tabActive === 1 ? (
                <div id='review' className='tab-content'>
                    <div>Phim hay lắm nhé</div>
                    <div>Phim hay lắm nhé</div>
                    <div>Phim hay lắm nhé</div>
                    <div>Phim hay lắm nhé</div>
                </div>
            ) : null}
            <style jsx>{`
                iframe {
                    width: 100%;
                    height: 12rem;
                }
                .tab-content {
                    animation: fadeIn 0.3s ease-in-out;
                }
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transfrom: translateY(-5rem);
                    }
                    100% {
                        opacity: 1;
                        transfrom: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

// export const getServerSideProps = withUserServerSideProps();
export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${apiURL}/api/movies`);
    const movies = await res.json();

    // Get the paths we want to pre-render based on posts
    const paths = movies.map((movie) => `/movies/${movie.id}`);

    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false };
}
export async function getStaticProps({ params: { movieId } }) {
    const res = await fetch(`${apiURL}/api/movies/${movieId}`);
    const movie = await res.json();

    return {
        props: { movie },
    };
}
export default Movie;
