import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { apiURL } from "../../redux/api";
import { useState } from "react";
import dayjs from "dayjs";

function Movie({ movie: { name, description, runningTime, releaseDate, trailer, filmDirectors, actors } }) {
    const [tabActive, setTabActive] = useState(0);
    const [loadingIframeTrailer, setLoadingIframeTrailer] = useState(true);
    const tabsList = [
        { name: "Thông tin phim", id: "info" },
        { name: "Đánh giá", id: "review" },
    ];

    const changeTab = (i) => {
        setTabActive(i);
        if (i === 0) {
            setLoadingIframeTrailer(true);
        }
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };
    const handleFinishLoadingTrailer = () => {
        setLoadingIframeTrailer(false);
    };

    return (
        <div className='px-3 py-5'>
            <Head>
                <title>Phim {name}</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div className='tabs'>
                <ul>
                    {tabsList.map(({ id, name }, i) => (
                        <li key={id} className={tabActive === i ? "is-active" : ""}>
                            <a onClick={() => changeTab(i)} href={`#${id}`}>
                                {name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            {tabActive === 0 ? (
                <div id='info' className='tab-content py-3 mb-6'>
                    <div className='basic-info mb-3'>
                        <h1 className='has-text-centered has-text-weight-bold'>{name}</h1>
                        <p>{description}</p>
                        {releaseDate ? (
                            <p>
                                <span className='has-text-weight-semibold'>Thời gian công chiếu</span>:{" "}
                                {dayjs(releaseDate).format("DD/MM/YYYY")}
                            </p>
                        ) : null}
                        {runningTime ? (
                            <p>
                                <span className='has-text-weight-semibold'>Thời lượng</span>: {runningTime} phút
                            </p>
                        ) : null}
                        <p>
                            <span className='has-text-weight-semibold'>Đạo diễn</span>:{" "}
                            {filmDirectors.map((director, i) => (
                                <span key={i}>
                                    {director}
                                    {i !== filmDirectors.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                        <p>
                            <span className='has-text-weight-semibold'>Diễn viên</span>:{" "}
                            {actors.map((actor, i) => (
                                <span key={i}>
                                    {actor}
                                    {i !== actors.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </p>
                    </div>
                    {trailer ? (
                        <div className='ytb-video'>
                            {loadingIframeTrailer ? <div className='has-text-centered'>Đang tải trailer...</div> : null}
                            <iframe onLoad={handleFinishLoadingTrailer} src={trailer} />
                        </div>
                    ) : null}
                    <div className='moveek-link-wp'>
                        <a href='https://moveek.com' target='_blank'>
                            Moveek
                        </a>
                    </div>
                </div>
            ) : null}

            {tabActive === 1 ? (
                <div id='review' className='tab-content py-3 mb-5'>
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
                }
                .ytb-video {
                    position: relative;
                    height: 14rem;
                }
                .ytb-video iframe {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 2;
                }
                .moveek-link-wp {
                    display: flex;
                    justify-content: flex-end;
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

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch(`${apiURL}/api/movies?pageSize=100`);
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
