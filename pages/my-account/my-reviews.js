import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewItem from "../../components/ReviewItem";
import { getMyReviews } from "../../redux/review/actions";

export default function MyReviews() {
    const dispatch = useDispatch();
    const { reviewsList, loaded } = useSelector((state) => state.review);

    useEffect(() => {
        dispatch(getMyReviews());
    }, [dispatch]);

    return (
        <div className='my-reviews'>
            {loaded && reviewsList.length === 0 ? (
                <div>Bạn chưa có review nào</div>
            ) : loaded ? (
                reviewsList.map((review) => (
                    <ReviewItem review={review} name={review.movie.name} displayAvatar={false} />
                ))
            ) : null}
        </div>
    );
}
