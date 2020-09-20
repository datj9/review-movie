import Head from "next/head";
import fetch from "isomorphic-unfetch";
import { apiURL } from "../../redux/api";
import { useState } from "react";
import dayjs from "dayjs";

function Movie() {
    // const [loadingIframeTrailer, setLoadingIframeTrailer] = useState(true);
    // const tabsList = [
    //     { name: "Thông tin phim", href: `/movies/${id}` },
    //     { name: "Đánh giá từ cộng đồng", href: `/reviews?mid=${id}` },
    // ];

    // const handleFinishLoadingTrailer = () => {
    //     setLoadingIframeTrailer(false);
    // };

    return (
        <div className='px-3 py-5'>
            {/* <Head>
                <title>Phim {name}</title>
                <link rel='icon' href='/favicon.ico' />
            </Head> */}
            {/* <div className='tabs'>
                <ul className='tabs-list'>
                    {tabsList.map(({ name, href }, i) => (
                        <li key={i} className={i === 0 ? "is-active" : "has-text-black"}>
                            <a href={href}>{name}</a>
                        </li>
                    ))}
                </ul>
            </div>

            <div id='info' className='tab-content py-3 mb-6'>
                <div className='basic-info mb-3'>
                    <h1 className='has-text-centered has-text-weight-bold has-text-black'>{name}</h1>
                    <p>{description}</p>
                    {releaseDate ? (
                        <p>
                            <span className='has-text-weight-semibold has-text-black'>Thời gian công chiếu</span>:{" "}
                            {dayjs(releaseDate).format("DD/MM/YYYY")}
                        </p>
                    ) : null}
                    {runningTime ? (
                        <p>
                            <span className='has-text-weight-semibold has-text-black'>Thời lượng</span>: {runningTime}{" "}
                            phút
                        </p>
                    ) : null}
                    <p>
                        <span className='has-text-weight-semibold has-text-black'>Đạo diễn</span>:{" "}
                        {filmDirectors.map((director, i) => (
                            <span key={i}>
                                {director}
                                {i !== filmDirectors.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                    <p>
                        <span className='has-text-weight-semibold has-text-black'>Diễn viên</span>:{" "}
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
                        {loadingIframeTrailer ? (
                            <div className='has-text-centered has-text-black'>Đang tải trailer...</div>
                        ) : null}
                        <iframe onLoad={handleFinishLoadingTrailer} src={trailer} />
                    </div>
                ) : null}
                <div className='moveek-link-wp'>
                    <a href='https://moveek.com' target='_blank'>
                        Moveek
                    </a>
                </div>
            </div> */}

            <style jsx>{`
                iframe {
                    width: 100%;
                    height: 12rem;
                }
                .tabs-list,
                .tabs li:not(.is-active) a:hover,
                .tabs li:not(.is-active) a {
                    border-bottom-color: transparent;
                }

                .tabs-list::-webkit-scrollbar {
                    display: none;
                }

                .tabs-list {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
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

// export async function getStaticPaths() {
//     // Call an external API endpoint to get posts
//     const res = await fetch(`${apiURL}/api/movies?pageSize=1000`);
//     const { movies } = await res.json();

//     // Get the paths we want to pre-render based on posts
//     const paths = movies.map((movie) => `/movies/${movie.id}`);

//     // We'll pre-render only these paths at build time.
//     // { fallback: false } means other routes should 404.
//     return { paths, fallback: false };
// }
// export async function getStaticProps({ params: { movieId } }) {
//     const res = await fetch(`${apiURL}/api/movies/${movieId}`);
//     const movie = await res.json();

//     return {
//         props: { movie },
//         revalidate: 20 * 60, // seconds
//     };
// }

export default Movie;
