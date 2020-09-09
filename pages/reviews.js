import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import RateReview from "@material-ui/icons/RateReview";
import fetch from "isomorphic-unfetch";
import Star from "@material-ui/icons/Star";
import StarHalf from "@material-ui/icons/StarHalf";
import StarBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import { useSelector } from "react-redux";
import ContentLoader, { Facebook } from "react-content-loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/vi";

dayjs.locale("vi");
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const fetcher = (url) => fetch(url).then((r) => r.json());

function Reviews(props) {
    const router = useRouter();
    const writeReviewBtnRef= useRef()
    const [modalOpen, setModalOpen] = useState(false);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const modalRef = useRef();
    const { isSuccess, isLoading } = useSelector((state) => state.review);
    const user = JSON.parse(props.user);
    const isAuthenticated = Object.keys(user).length;
    const { mid: movieId, tid: theaterId } = router.query;
    const [btnWriteReviewWidth, setBtnWriteReviewWidth] = useState(0);
    const [btnWriteReviewHeight, setBtnWriteReviewHeight] = useState(0);
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
    const { data, error } = useSWR(
        `/api/reviews?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}&pageIndex=${pageIndex}`,
        fetcher,
        {
            onErrorRetry: (error, key, option, revalidate, { retryCount }) => {
                if (retryCount >= 4) return;
                if ((error.status = 404)) return;

                setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
            },
        }
    );
    const reviewsList = data?.reviews || [];
    const movie = data?.movie || {};
    const total = data?.total || 0;
    const averageRating = movie?.averageRating || 0;
    const numberOfPages = total && Math.ceil(total / 10) || 0;

    const createReview = async (newReview) => {
        await fetch("/api/reviews", {
            method: "POST",
            body: JSON.stringify(newReview),
            headers: { "Content-Type": "application/json" },
        });
    };
    const submitCreateReview = async () => {
        const newReview = { text, rating, movieId, user: user.id };
        closeModal();
        mutate(`/api/reviews?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}&pageIndex=${pageIndex}`, {
            ...data,
            reviews: [{ ...newReview, user, id: Math.floor(Math.random() * Math.pow(10, 6)) + "" }, ...reviewsList],
        });
        await createReview(newReview);
        mutate(`/api/reviews?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}&pageIndex=${pageIndex}`);
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
        setText("");
        setRating(0);
    };
    const decreasePageIndex = () => {
        if (pageIndex > 1) {
            setPageIndex(pageIndex - 1);
        }
    };
    const increasePageIndex = () => {
        if (pageIndex < numberOfPages) {
            setPageIndex(pageIndex + 1);
        }
    };

    const Skeleton = () => {
        const reviewsSkeleton = [];
        const windowWidth = typeof document !== 'undefined' ? document.documentElement.clientWidth : 0;
        const viewBoxWidth =  typeof document !== 'undefined' ? document.documentElement.offsetWidth - 2 * 0.75 * 16 : 0
        const titleAndBtnHeight = typeof document !== 'undefined' ? (document.documentElement.clientWidth > 576 ? 78 : 95) : 0
        const titleHeight = 1.25 * 16;
        const titleWidth = windowWidth > 576 ? windowWidth / 4 :windowWidth * 3 / 4 ;
        const cardHeight = 119;
        const cardWidth = viewBoxWidth;
        const rOfAvatar = 2.5 * 16 / 2;
        const nameWidth = windowWidth > 576 ? viewBoxWidth / 8  : viewBoxWidth * 2 / 5
        const textHeight = 16;
        const textWidth = viewBoxWidth * 4 / 5
      
        for (let i = 0; i < 4; i++) {
            reviewsSkeleton.push(
                <ContentLoader key={i} className='mb-4' viewBox={`-16 0 ${cardWidth} ${cardHeight}`}>
                    <circle cx={rOfAvatar +''} cy={rOfAvatar +''} r={rOfAvatar +''} />
                    <rect rx='5' ry='5' x='60' y='0' width={nameWidth +''} height={textHeight +''} />
                    <rect rx='5' ry='5' x='60' y={textHeight + 10 +''} width={nameWidth * 3 / 4 +''} height={textHeight +''} />
                    <rect rx='5' ry='5' x='5' y={2 * textHeight + 20 +''} width={nameWidth +''} height={textHeight +''} />
                    <rect rx='5' ry='5' x='5' y={3 * textHeight + 30 +''} width={textWidth +''} height={textHeight +''} />
                </ContentLoader>
            );
        }

        return (
            <div className='px-3 pb-3 my-5'>
                <ContentLoader className='mb-5' viewBox={`0 0 ${viewBoxWidth} ${titleAndBtnHeight}`}>
                    <rect rx='5' ry='5' x='0' y='0' width={titleWidth +''} height={titleHeight +''} />
                    <rect rx='5' ry='5' x={windowWidth >= 576 ? titleWidth + 16 +''  :'0' } y={windowWidth >= 576 ? '0' : titleHeight * 5 / 4 +''} width={titleWidth * 3 / 5 +''} height={titleHeight +''} />
                    <rect rx='20' ry='20' x='0' y={titleAndBtnHeight - btnWriteReviewHeight +''} width={btnWriteReviewWidth +''} height={btnWriteReviewHeight +''} />
                </ContentLoader>
                {reviewsSkeleton}
            </div>
        );
    };
    const Pagination = () => {
        if(total === undefined || total <= 10) {
            return null
        }else if (total <= 90) {
            const list = [];

            for (let i = 0; i < numberOfPages; i++) {
                list.push(
                    <li onClick={() => setPageIndex(i + 1)} key={i}>
                        <a className={`pagination-link ${pageIndex !== i + 1 ? "" : "is-current"}`}>{i + 1}</a>
                    </li>
                );
            }
            return <ul className='pagination-list'>{list}</ul>;
        } else {
            return (
                <ul className='pagination-list'>
                    <li onClick={() => setPageIndex(1)}>
                        <a className='pagination-link' aria-label='Goto page 1'>
                            1
                        </a>
                    </li>
                    <li onClick={() => setPageIndex(Math.round(numberOfPages / 4))}>
                        <span className='pagination-ellipsis'>&hellip;</span>
                    </li>
                    <li onClick={() => setPageIndex(Math.round(numberOfPages / 2 - 1))}>
                        <a className='pagination-link'>{Math.round(numberOfPages / 2 - 1)}</a>
                    </li>
                    <li onClick={() => setPageIndex(Math.round(numberOfPages / 2))}>
                        <a className='pagination-link is-current' aria-label='Page 46' aria-current='page'>
                            {Math.round(numberOfPages / 2)}
                        </a>
                    </li>
                    <li onClick={Math.round(numberOfPages / 2 + 1)}>
                        <a className='pagination-link' aria-label='Goto page 47'>
                            {Math.round(numberOfPages / 2 + 1)}
                        </a>
                    </li>
                    <li onClick={() => setPageIndex(Math.round((3 * numberOfPages) / 4))}>
                        <span className='pagination-ellipsis'>&hellip;</span>
                    </li>
                    <li onClick={() => setPageIndex(numberOfPages)}>
                        <a className='pagination-link' aria-label='Goto page 86'>
                            {numberOfPages}
                        </a>
                    </li>
                </ul>
            );
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });
    useEffect(() => {
        setBtnWriteReviewWidth(161)
        setBtnWriteReviewHeight(40)
})
    if (error) return <div className='has-text-centered'>Error</div>;

    return (
        <div>
            <Head>
                <title>Đánh giá {movieId ? "phim" : theaterId ? "rạp" : ""} từ cộng đồng </title>
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='tabs pb-3 my-5'>
                <ul>
                    {tabsList.map(({ name, href }, i) => (
                        <li key={i} className={i === 1 ? "is-active" : "has-text-black"}>
                            <a href={href}>{name}</a>
                        </li>
                    ))}
                </ul>
                </div>
       
            {!data ? (
                <Skeleton />
            ) :(
                <div className='tab-content px-3 py-3 mb-6'>
                    <div>
                        <div className='movie-info is-flex mb-2'>
                            <h1  className='has-text-weight-bold has-text-black mr-3 is-size-5'>
                                {movie.name ? movie.name : ""}
                            </h1>
                            {averageRating ? (
                                <div className='is-flex'>
                                    {[1, 2, 3, 4, 5].map((grade) =>
                                        averageRating >= grade ? (
                                            <Star key={grade} htmlColor='yellow' />
                                        ) : averageRating - Math.floor(averageRating) >= 0.5 ? (
                                            <StarHalf key={grade} htmlColor='yellow' />
                                        ) : (
                                            <StarBorderOutlined key={grade} htmlColor='yellow' />
                                        )
                                    )}
                                    <span className='ml-2'>{Math.round(averageRating * 10) / 10} / 5</span>
                                </div>
                            ) : null}
                        </div>

                        <button ref={writeReviewBtnRef} onClick={openModal} className='button is-primary is-rounded'>
                            <span className='icon'>
                                <RateReview />
                            </span>
                            <span>Viết Đánh Giá</span>
                        </button>
                    </div>
                    <div className='my-5'>
                        {total === 0 ? (
                            <div className='has-text-black'>Chưa có đánh giá nào</div>
                        ) : (
                            <div className='reviews-list'>
                                {reviewsList.map((review) => (
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
                                                <span className='has-text-black'>
                                                    {Date.now() - new Date(review.createdAt).getTime() >=
                                                    3 * 24 * 60 * 60 * 1000
                                                        ? dayjs(review.createdAt).format("kk:mm DD/MM/YYYY")
                                                        : dayjs(review.createdAt).fromNow()}
                                                </span>
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
                                ))}
                               {total > 10 ? <nav className='pagination' role='navigation' aria-label='pagination'>
                                    <a
                                        disabled={pageIndex === 1}
                                        onClick={decreasePageIndex}
                                        className='pagination-previous'
                                    >
                                        Trang trước
                                    </a>
                                    <a
                                        disabled={pageIndex === numberOfPages}
                                        onClick={increasePageIndex}
                                        className='pagination-next'
                                    >
                                        Trang kế tiếp
                                    </a>
                                    <Pagination />
                                </nav>: null}
                            </div>
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
                                    <label className='label'>Nội dung đánh giá (ít nhất 10 ký tự)</label>
                                    <div className='control'>
                                        <textarea
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className='textarea'
                                            placeholder='Nhập vào nội dung đánh giá'
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
            )}
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
