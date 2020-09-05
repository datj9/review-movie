import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import StarIcon from "@material-ui/icons/Star";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import LazyImage from "../components/LazyImage";

const apiURL = process.env.API_URL;

function elementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return rect.left + 80 <= (window.innerWidth || document.documentElement.clientWidth);
}

function Home(props) {
    const { movies } = props;
    const nowShowingRef = useRef();

    // const [loaded, setLoaded] = useState(false);

    // const handleScroll = () => {
    //     if (!loaded && elementInViewport(imgRef.current)) {
    //         const imgLoader = new Image();

    //         imgLoader.src = "https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg";
    //         imgLoader.onload = () => {
    //             console.log("in onload");
    //             imgRef.current.setAttribute(
    //                 `src`,
    //                 `https://cdn.moveek.com/media/cache/short/5f17a7c1b1c57272959714.jpg`
    //             );
    //             setLoaded(true);
    //         };
    //     }
    // };

    useEffect(() => {
        // nowShowingRef.current.addEventListener("scroll", handleScroll);
        // return () => {
        //     nowShowingRef.current.removeEventListener("scroll", handleScroll);
        // };
    }, []);

    return (
        <div>
            <Head>
                <title>Đánh Giá Phim - Tìm Phim Hay, Rạp Xịn</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main className='py-5 mb-6 pl-3'>
                <div className='list-and-title-wp mb-5'>
                    <div className='title-container mb-3 pr-3'>
                        <h2 className='has-text-black'>Phim Đang Chiếu</h2>
                        <Link href='/'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div ref={nowShowingRef} className='list-movies'>
                        {movies[0].map((movie, index) => (
                            <Link key={movie.id} href={`/movies/[movieId]`} as={`/movies/${movie.id}`}>
                                <a
                                    title={movie.name}
                                    className={`movie-card ${index !== movies[0].length - 1 ? "mr-5" : "mr-3"}`}
                                >
                                    <div className='img-wrapper'>
                                        <LazyImage listIndex={0} src={movie.image} alt={movie.name} />
                                    </div>

                                    <div className='has-text-black px-1'>
                                        <span className='card-title'>{movie.name}</span>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='list-and-title-wp'>
                    <div className='title-container mb-3 pr-3'>
                        <h2 className='has-text-black'>Phim Sắp Chiếu</h2>
                        <Link href='/'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div className='list-movies'>
                        {movies[1].map((movie, index) => (
                            <Link key={movie.id} href={`/movies/${movie.id}`}>
                                <a
                                    title={movie.name}
                                    className={`movie-card ${index !== movies[1].length - 1 ? "mr-5" : "mr-3"}`}
                                >
                                    <LazyImage listIndex={1} src={movie.image} alt={movie.name} />
                                    <div className='icons-wp has-text-grey-dark px-1'>
                                        <span className='is-flex'>
                                            <span className='mr-1'>4.7</span>
                                            <StarIcon className='has-text-primary' />
                                        </span>
                                        <span className='is-flex'>
                                            <span className='mr-1'>99</span>
                                            <ThumbUpIcon htmlColor='#f69314' />
                                        </span>
                                    </div>
                                    <div className='has-text-black px-1'>
                                        <span className='card-title'>{movie.name}</span>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* <footer className='has-background-info'>
                    <a
                        href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        Powered by <img src='/vercel.svg' alt='Vercel Logo' />
                    </a>
                </footer> */}
            <style jsx>
                {`
                    .list-movies {
                        overflow: auto;
                        white-space: nowrap;
                    }
                    .movie-card {
                        display: inline-block;
                        width: 8rem;
                        border: 1px solid #e8e8e8;
                        overflow: hidden;
                        border-radius: 4px;
                    }
                    .img-wrapper {
                        height: 12rem;
                    }
                    .movie-card img {
                        width: 100%;
                        height: 100%;
                        border-bottom: 1px solid #e8e8e8;
                    }
                    .title-container {
                        font-weight: 700;
                        font-size: 1rem;
                        display: flex;
                        justify-content: space-between;
                    }
                    .title-container h2 {
                        font-weight: inherit;
                        font-size: inherit;
                    }
                    .card-title {
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        width: 100%;
                        display: inline-block;
                    }
                    .icons-wp {
                        display: flex;
                        justify-content: space-between;
                    }

                    @media only screen and (min-width: 768px) {
                        .title-container {
                            font-size: 1.2rem;
                        }
                        .movie-card {
                            width: 10rem;
                        }
                        .img-wrapper {
                            height: 15rem;
                        }
                    }
                `}
            </style>
            <style jsx global>
                {`
                    .icons-wp svg {
                        width: 1rem;
                    }
                    .thumbs-up-icon {
                        color: #f69314;
                    }
                `}
            </style>
        </div>
    );
}

export async function getStaticProps(context) {
    const status = ["1", "0"];
    const { data: movies } = await axios.get(`${apiURL}/api/movies?status=${JSON.stringify(status)}`);

    return {
        props: {
            movies,
        },
    };
}

export default Home;
