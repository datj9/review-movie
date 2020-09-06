import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import RateReview from "@material-ui/icons/RateReview";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Star from "@material-ui/icons/Star";
import StarHalf from "@material-ui/icons/StarHalf";
import StarBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../redux/review/actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { CLEAN_UP } from "../redux/review/action-types";

dayjs.locale("vi");
dayjs.extend(relativeTime);

function Reviews(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const modalRef = useRef();
    const { isSuccess, isLoading } = useSelector((state) => state.review);
    const user = JSON.parse(props.user);
    const isAuthenticated = Object.keys(user).length;
    const { mid: movieId, tid: theaterId } = router.query;
    const tabsList = [
        {
            name: movieId ? "Thông tin phim" : theaterId ? "Thông tin rạp" : "",
            href: movieId ? `/movies/${movieId}` : `/theaters/${theaterId}`,
        },
        {
            name: "Đánh giá từ cộng đồng",
            href: `/reviews?${movieId ? `movieId=${movieId}` : theaterId ? `theaterId=${theaterId}` : ""}`,
        },
    ];
    const submitCreateReview = async () => {
        if (isAuthenticated) {
            dispatch(createReview({ text, rating, movieId, user: user.id }));
        } else {
            router.push("/login");
        }
    };
    const handleClick = (e) => {
        if (!modalRef.current?.contains(e.target)) {
            closeModal();
        }
    };
    const openModal = () => {
        if (isAuthenticated) {
            setModalOpen(true);
        } else {
            router.push("/login");
        }
    };
    const closeModal = () => {
        setModalOpen(false);
        dispatch({
            type: CLEAN_UP,
        });
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    useEffect(() => {
        if (isSuccess) {
            closeModal();
            setText("");
            setRating(0);
        }
    }, [isSuccess]);

    if (movieId || theaterId) {
        const { data: res, error } = useSWR(
            `/api/reviews?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}`,
            axios
        );

        if (error) return <div>Error</div>;
        if (!res) return <div>Loading...</div>;
        const reviewsList = res.data.reviews;
        const movie = res.data.movie;
        const total = res.data.total;
        const averageRating = movie.averageRating;
        return (
            <div>
                <Head>
                    <title>Đánh giá {movieId ? "phim" : theaterId ? "rạp" : ""} từ cộng đồng </title>
                    <link rel='icon' href='/favicon.ico' />
                </Head>
                <div className='tabs'>
                    <ul>
                        {tabsList.map(({ name, href }, i) => (
                            <li key={i} className={i === 1 ? "is-active" : "has-text-black"}>
                                <a href={href}>{name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='tab-content px-3 py-3 mb-5'>
                    <div className='movie-info is-flex mb-2'>
                        <h1 className='has-text-weight-bold has-text-black mr-3 is-size-5'>
                            {movie.name ? movie.name : ""}
                        </h1>
                        {averageRating ? (
                            <div>
                                {[1, 2, 3, 4, 5].map((grade) =>
                                    averageRating >= grade ? (
                                        <Star key={grade} htmlColor='yellow' />
                                    ) : averageRating - Math.floor(averageRating) >= 0.5 ? (
                                        <StarHalf key={grade} htmlColor='yellow' />
                                    ) : (
                                        <StarBorderOutlined key={grade} htmlColor='yellow' />
                                    )
                                )}
                            </div>
                        ) : null}
                    </div>
                    <button onClick={openModal} className='button is-primary is-rounded'>
                        <span className='icon'>
                            <RateReview />
                        </span>
                        <span>Viết Đánh Giá</span>
                    </button>
                    <div className='my-5'>
                        {total === 0 ? (
                            <div className='has-text-black'>Chưa có đánh giá nào</div>
                        ) : (
                            reviewsList.map((review) => (
                                <div key={review.id} className='review-item mb-4 py-2 px-4'>
                                    <div className='header-review-item is-flex'>
                                        <div className='avatar mr-2 is-flex'>
                                            {review.user.image ? (
                                                <span className='is-block'>
                                                    <img src={review.user.image} />
                                                </span>
                                            ) : (
                                                <span className='name-icon is-flex has-text-white'>Đ</span>
                                            )}
                                        </div>
                                        <div className='name-and-time is-flex'>
                                            <span className='has-text-black'>{review.user.name}</span>
                                            <span className='has-text-black'>{dayjs(review.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        {[1, 2, 3, 4, 5].map((grade) =>
                                            grade <= review.rating ? (
                                                <Star key={grade} htmlColor='yellow' />
                                            ) : (
                                                <StarBorderOutlined key={grade} htmlColor='yellow' />
                                            )
                                        )}
                                    </div>
                                    <div className='review-text has-text-black ml-1'>{review.text}</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={`modal ${modalOpen ? "is-active" : ""}`}>
                        <div className='modal-background'></div>
                        <div ref={modalRef} className='modal-card'>
                            <header className='modal-card-head'>
                                <p className='modal-card-title'>Viết Đánh Giá</p>
                            </header>
                            <section className='modal-card-body'>
                                <div className='field'>
                                    <label className='label'>Nội dung đánh giá</label>
                                    <div className='control'>
                                        <textarea
                                            onChange={(e) => setText(e.target.value)}
                                            className='textarea'
                                            placeholder='Nhập vào nội dung đánh giá (ít nhất 10 ký tự)'
                                        />
                                    </div>
                                </div>
                                <div className='field'>
                                    <label className='label'>Đánh giá</label>
                                    {[1, 2, 3, 4, 5].map((grade) =>
                                        grade <= rating ? (
                                            <span key={grade} role='button' onClick={() => setRating(grade)}>
                                                <Star htmlColor='yellow' />
                                            </span>
                                        ) : (
                                            <span key={grade} role='button' onClick={() => setRating(grade)}>
                                                <StarBorderOutlined htmlColor='yellow' />
                                            </span>
                                        )
                                    )}
                                </div>
                            </section>
                            <footer className='modal-card-foot'>
                                <button
                                    disabled={text.length < 10 || rating === 0 || isLoading}
                                    onClick={submitCreateReview}
                                    className={`button is-primary ${isLoading ? "is-loading" : ""}`}
                                >
                                    Đăng
                                </button>
                                <button onClick={closeModal} className='button'>
                                    Hủy
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
                <style jsx>
                    {`
                        .movie-info {
                            flex-direction: column;
                        }
                        .review-item {
                            border: 1px solid #e8e8e8;
                            border-radius: 3px;
                        }
                        .header-review-item {
                            justify-content: flex-start;
                        }
                        .avatar {
                            width: 2.5rem;
                            height: 2.5rem;
                            border-radius: 50%;
                        }
                        .avatar img {
                            border-radius: 50%;
                        }
                        .name-icon {
                            width: 100%;
                            height: 100%;
                            justify-content: center;
                            align-items: center;
                            background: green;
                            border-radius: 50%;
                        }
                        .name-and-time {
                            flex-direction: column;
                        }
                        @media only screen and (min-width: 576px) {
                            .movie-info {
                                flex-direction: row;
                            }
                        }
                    `}
                </style>
            </div>
        );
    } else {
        return <div></div>;
    }
}

export const getServerSideProps = ({ req }) => {
    const user = req.user ? req.user : {};

    return {
        props: {
            user: JSON.stringify(user),
        },
    };
};

export default Reviews;
