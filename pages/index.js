import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/actions";

const apiURL = process.env.API_URL;

function Home(props) {
    const dispatch = useDispatch();
    const { movies } = props;
    const user = JSON.parse(props.user);
    console.log(Object.keys(user));
    if (Object.keys(user).length) {
        dispatch(setUser(user));
    }

    return (
        <div>
            <Head>
                <title>Đánh Giá Phim - Tìm Phim Hay, Rạp Xịn</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <main className='py-5 pl-3'>
                <div className='list-and-title-wp mb-5'>
                    <div className='title-container mb-3 pr-3'>
                        <span className='has-text-black'>Phim Đang Chiếu</span>
                        <Link href='/'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div className='list-movies'>
                        {movies[0].map((movie, index) => (
                            <Link key={movie.id} href='/'>
                                <a className={index !== movies[0].length - 1 ? "movie-card mr-5" : "movie-card"}>
                                    <img src={movie.image} alt={movie.name} />
                                    <div className='icons-wp has-text-grey-dark px-1'>
                                        <span>
                                            <span>4.7 </span>
                                            <FontAwesomeIcon
                                                style={{ width: "1rem", color: "#f69314" }}
                                                icon={faStar}
                                            />
                                        </span>
                                        <span>
                                            <span>99 </span>
                                            <FontAwesomeIcon
                                                style={{ width: "1rem", color: "#f69314" }}
                                                icon={faThumbsUp}
                                            />
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

                <div className='list-and-title-wp'>
                    <div className='title-container mb-3 pr-3'>
                        <span className='has-text-black'>Phim Sắp Chiếu</span>
                        <Link href='/'>
                            <a>Xem Tất Cả</a>
                        </Link>
                    </div>
                    <div className='list-movies'>
                        {movies[1].map((movie, index) => (
                            <Link key={movie.id} href='/'>
                                <a className={index !== movies[1].length - 1 ? "movie-card mr-5" : "movie-card"}>
                                    <img src={movie.image} alt={movie.name} />
                                    <div className='icons-wp has-text-grey-dark px-1'>
                                        <span>
                                            <span>4.7 </span>
                                            <FontAwesomeIcon
                                                style={{ width: "1rem", color: "#f69314" }}
                                                icon={faStar}
                                            />
                                        </span>
                                        <span>
                                            <span>99 </span>
                                            <FontAwesomeIcon
                                                style={{ width: "1rem", color: "#f69314" }}
                                                icon={faThumbsUp}
                                            />
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
                    }
                    .movie-card img {
                        width: 100%;
                        height: 24rem;
                    }
                    .title-container {
                        font-weight: 700;
                        font-size: 1rem;
                        display: flex;
                        justify-content: space-between;
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
                `}
            </style>
        </div>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    const status = ["1", "0"];
    const { data: movies } = await axios.get(`${apiURL}/api/movies?status=${JSON.stringify(status)}`);
    const user = req.user ? req.user : {};

    return {
        props: {
            movies,
            user: JSON.stringify(user),
        },
    };
};

export default Home;
