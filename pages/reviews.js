import { useRouter } from "next/router";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import RateReview from "@material-ui/icons/RateReview";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef, useState } from "react";
import Star from "@material-ui/icons/Star";
import StarBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import StarHalf from "@material-ui/icons/StarHalf";

dayjs.locale("vi");
dayjs.extend(relativeTime);

function Reviews(props) {
    const router = useRouter();
    const { mid: movieId, tid: theaterId } = router.query;
    const [modalOpen, setModalOpen] = useState(false);
    const modalRef = useRef();
    const user = JSON.parse(props.user);
    const isAuthenticated = Object.keys(user).length;
    const tabsList = [
        {
            name: movieId ? "Thông tin phim" : theaterId ? "Thông tin rạp" : "",
            href: movieId ? `/movies/${movieId}` : `/theaters/${theaterId}`,
        },
        {
            name: "Đánh giá",
            href: `/reviews?${movieId ? `movieId=${movieId}` : theaterId ? `theaterId=${theaterId}` : ""}`,
        },
    ];
    const createReview = async () => {
        if (isAuthenticated) {
            const res = await fetch("/api/reviews", {
                body: JSON.stringify({ text: "Phim rất hay", rating: 5, user: user.id, movieId }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = res.json();
        } else {
            router.push("/login");
        }
    };
    const handleClick = (e) => {
        if (!modalRef.current?.contains(e.target)) {
            setModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    if (movieId || theaterId) {
        const { data, error } = useSWR(
            `/api/reviews?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}`,
            axios
        );
        const { data: movieRes, error: errGetMovie } = useSWR(`/api/movies/${movieId}`, axios);

        if (error) return <div>Error</div>;
        if (!data || !movieRes) return <div>Loading...</div>;
        const reviewsList = data.data;
        const movie = movieRes.data;

        return (
            <div>
                <div className='tabs'>
                    <ul>
                        {tabsList.map(({ name, href }, i) => (
                            <li key={i} className={i === 1 ? "is-active" : ""}>
                                <a href={href}>{name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='tab-content px-3 py-3 mb-5'>
                    <div className='is-flex mb-2'>
                        <h1 className='has-text-bold mr-3'>{movie.name ? movie.name : ""}</h1>
                        <div>
                            <Star />
                            <Star />
                            <Star />
                            <StarHalf />
                            <StarBorderOutlined />
                        </div>
                    </div>
                    <button onClick={() => setModalOpen(true)} className='button is-primary is-rounded'>
                        <span className='icon'>
                            <RateReview />
                        </span>
                        <span>Viết Đánh Giá</span>
                    </button>
                    <div className='my-5'>
                        {reviewsList.map((review) => (
                            <div key={review.id} className='review-item mb-4 py-2 px-4'>
                                <div className='header-review-item is-flex'>
                                    <div className='avatar mr-2 is-flex'>
                                        {review.user.image ? (
                                            <span className='is-block'>
                                                <img src={user.image} />
                                            </span>
                                        ) : (
                                            <span className='name-icon is-flex has-text-white'>Đ</span>
                                        )}
                                    </div>
                                    <div className='name-and-time is-flex'>
                                        <span>{review.user.name}</span>
                                        <span>{dayjs(review.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                                <div className='review-text'>{review.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className={`modal ${modalOpen ? "is-active" : ""}`}>
                        <div className='modal-background'></div>
                        <div ref={modalRef} className='modal-card'>
                            <header className='modal-card-head'>
                                <p className='modal-card-title'>Viết Đánh Giá</p>
                                {/* <button className='delete' aria-label='close'></button> */}
                            </header>
                            <section className='modal-card-body'></section>
                            <footer className='modal-card-foot'>
                                <button onClick={createReview} className='button is-success'>
                                    Đăng
                                </button>
                                <button onClick={() => setModalOpen(false)} className='button'>
                                    Hủy
                                </button>
                            </footer>
                        </div>
                    </div>
                </div>
                <style jsx>
                    {`
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
                        }
                        .name-and-time {
                            flex-direction: column;
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
