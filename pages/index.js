import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LazyImage from "../components/HorizontalLazyImage";
import connectDB from "../setup/connectDB";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

function Home(props) {
    const movies = JSON.parse(props.movies);
    const [
        showChevronRightNowShowing,
        setShowChevronRightNowShowing,
    ] = useState(true);
    const [showChevronLeftNowShowing, setShowChevronLeftNowShowing] = useState(
        false
    );
    const [
        showChevronRightCommingSoon,
        setShowChevronRightCommingSoon,
    ] = useState(true);
    const [
        showChevronLeftCommingSoon,
        setShowChevronLeftCommingSoon,
    ] = useState(false);

    const nowShowingList = useRef();
    const commingSoonList = useRef();

    const scrollRight = (listIndex) => {
        let scrolled = 0;

        if (listIndex === 0) {
            const setIntervalToLeft = setInterval(() => {
                if (scrolled < 400) {
                    nowShowingList.current.scrollLeft += 50;
                    scrolled += 50;
                } else {
                    clearInterval(setIntervalToLeft);
                }
            }, 20);
        } else {
            const setIntervalToRight = setInterval(() => {
                if (scrolled < 400) {
                    commingSoonList.current.scrollLeft += 50;
                    scrolled += 50;
                } else {
                    clearInterval(setIntervalToRight);
                }
            }, 20);
        }
    };

    const scrollLeft = (listIndex) => {
        let scrolled = 0

        if (listIndex === 0) {
            const setIntervalToLeft = setInterval(() => {
                if (scrolled < 400) {
                    nowShowingList.current.scrollLeft -= 50;
                    scrolled += 50;
                } else {
                    clearInterval(setIntervalToLeft);
                }
            }, 20);
        } else {
            const setIntervalToLeft = setInterval(() => {
                if (scrolled < 400) {
                    commingSoonList.current.scrollLeft -= 50;
                    scrolled += 50;
                } else {
                    clearInterval(setIntervalToLeft);
                }
            }, 20);
        }
    };

    const handleNowShowingScroll = () => {
        const list = nowShowingList.current;

        if (
            list.scrollLeft + list.clientWidth < list.scrollWidth &&
            list.scrollLeft > 0
        ) {
            setShowChevronRightNowShowing(true);
            setShowChevronLeftNowShowing(true);
        } else if (list.scrollLeft === 0) {
            setShowChevronLeftNowShowing(false);
        } else {
            setShowChevronRightNowShowing(false);
        }
    };

    const handleCommingSoonScroll = () => {
        const list = commingSoonList.current;

        if (
            list.scrollLeft + list.clientWidth < list.scrollWidth &&
            list.scrollLeft > 0
        ) {
            setShowChevronRightCommingSoon(true);
            setShowChevronLeftCommingSoon(true);
        } else if (list.scrollLeft === 0) {
            setShowChevronLeftCommingSoon(false);
        } else {
            setShowChevronRightCommingSoon(false);
        }
    };

    useEffect(() => {
        nowShowingList.current.addEventListener(
            "scroll",
            handleNowShowingScroll
        );
        commingSoonList.current.addEventListener(
            "scroll",
            handleCommingSoonScroll
        );

        return () => {
            nowShowingList.current.removeEventListener(
                "scroll",
                handleNowShowingScroll
            );
            commingSoonList.current.removeEventListener(
                "scroll",
                handleCommingSoonScroll
            );
        };
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
                        <Link href='/now-showing'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div className='list-container'>
                        {showChevronLeftNowShowing ? (
                            <div
                                onClick={() => scrollLeft(0)}
                                className='scroll-left-btn'
                            >
                                <ChevronLeftIcon />
                            </div>
                        ) : null}
                        <div className='list-movies' ref={nowShowingList}>
                            {movies.nowShowing.map((movie, index) => (
                                <Link
                                    key={movie._id}
                                    href={`/movies/[movieId]`}
                                    as={`/movies/${movie._id}`}
                                >
                                    <a
                                        title={movie.name}
                                        className={`movie-card ${
                                            index !==
                                            movies.nowShowing.length - 1
                                                ? "mr-5"
                                                : "mr-3"
                                        }`}
                                    >
                                        <div className='img-wrapper'>
                                            <LazyImage
                                                listIndex={0}
                                                src={movie.image}
                                                alt={movie.name}
                                            />
                                        </div>

                                        <div className='has-text-black px-1 py-2 is-flex'>
                                            <span className='card-title'>
                                                {movie.name}
                                            </span>
                                        </div>
                                    </a>
                                </Link>
                            ))}
                        </div>
                        {showChevronRightNowShowing ? (
                            <div
                                onClick={() => scrollRight(0)}
                                className='scroll-right-btn'
                            >
                                <ChevronRightIcon />
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className='list-and-title-wp'>
                    <div className='title-container mb-3 pr-3'>
                        <h2 className='has-text-black'>Phim Sắp Chiếu</h2>
                        <Link href='/comming-soon'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div className='list-container'>
                        {showChevronLeftCommingSoon ? (
                            <div
                                onClick={() => scrollLeft(1)}
                                className='scroll-left-btn'
                            >
                                <ChevronLeftIcon />
                            </div>
                        ) : null}
                        <div className='list-movies' ref={commingSoonList}>
                            {movies.commingSoon.map((movie, index) => (
                                <Link
                                    key={movie._id}
                                    href={`/movies/${movie._id}`}
                                >
                                    <a
                                        title={movie.name}
                                        className={`movie-card ${
                                            index !==
                                            movies.commingSoon.length - 1
                                                ? "mr-5"
                                                : "mr-3"
                                        }`}
                                    >
                                        <LazyImage
                                            listIndex={1}
                                            src={movie.image}
                                            alt={movie.name}
                                        />

                                        <div className='has-text-black px-1 py-2 is-flex'>
                                            <span className='card-title'>
                                                {movie.name}
                                            </span>
                                        </div>
                                    </a>
                                </Link>
                            ))}
                        </div>
                        {showChevronRightCommingSoon ? (
                            <div
                                onClick={() => scrollRight(1)}
                                className='scroll-right-btn'
                            >
                                <ChevronRightIcon />
                            </div>
                        ) : null}
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
                    .list-container {
                        position: relative;
                    }
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
                    .scroll-right-btn,
                    .scroll-left-btn {
                        position: absolute;
                        top: 0;
                        height: 100%;
                        width: 2rem;
                        background: rgba(255, 255, 255, 0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 2;
                    }
                    .scroll-right-btn {
                        right: 0;
                    }
                    .scroll-left-btn {
                        left: -1px;
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

                    .list-movies::-webkit-scrollbar {
                        display: none;
                    }
                    ::-webkit-scrollbar-track {
                        border-radius: 10px;
                        box-shadow: inset 0 0 6px rgba(218, 218, 218, 0.5);
                        -webkit-box-shadow: inset 0 0 6px
                            rgba(218, 218, 218, 0.5);
                    }
                    ::-webkit-scrollbar-thumb {
                        border-radius: 5px;
                        box-shadow: inset 0 0 6px rgba(219, 219, 219, 0.8);
                        -webkit-box-shadow: inset 0 0 6px
                            rgba(219, 219, 219, 0.8);
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
    try {
        const db = await connectDB();
        const commingSoon = await db
            .collection("movies")
            .find({ status: 0 })
            .toArray();
        const nowShowing = await db
            .collection("movies")
            .find({ status: 1 })
            .toArray();

        return {
            props: {
                movies: JSON.stringify({
                    nowShowing,
                    commingSoon,
                }),
            },
            revalidate: 20 * 60, // seconds
        };
    } catch (error) {
        return {
            props: {
                movies: JSON.stringify({ 0: [], 1: [] }),
            },
        };
    }
}

export default Home;
