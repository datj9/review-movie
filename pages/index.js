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

    if (Object.keys(user).length) {
        dispatch(setUser(user));
    }
    useEffect(() => {
        localStorage.setItem("location", "hcm");
    });
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
                    <div className='list-movies'>
                        {movies[0].map((movie, index) => (
                            <Link key={movie.id} href={`/movies/[movieId]`} as={`/movies/${movie.id}`}>
                                <a
                                    title={movie.name}
                                    className={`movie-card ${index !== movies[0].length - 1 ? "mr-5" : "mr-3"}`}
                                >
                                    <img src={movie.image} alt={movie.name} />
                                    <div className='icons-wp has-text-grey-dark px-1'>
                                        <span>
                                            <span>4.7 </span>
                                            <FontAwesomeIcon className='has-text-primary' icon={faStar} />
                                        </span>
                                        <span>
                                            <span>99 </span>
                                            <FontAwesomeIcon className='thumbs-up-icon' icon={faThumbsUp} />
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
                                    <img src={movie.image} alt={movie.name} />
                                    <div className='icons-wp has-text-grey-dark px-1'>
                                        <span>
                                            <span>4.7 </span>
                                            <FontAwesomeIcon className='has-text-primary' icon={faStar} />
                                        </span>
                                        <span>
                                            <span>99 </span>
                                            <FontAwesomeIcon className='thumbs-up-icon' icon={faThumbsUp} />
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
                        border: 1px solid #d4d4d4;
                        overflow: hidden;
                        border-radius: 4px;
                    }
                    .movie-card img {
                        width: 100%;
                        height: 12rem;
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
