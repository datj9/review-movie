import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReviewItem from "../../components/ReviewItem";
import { getMyReviews } from "../../redux/review/actions";
import { withAuth, withAuthServerSideProps } from "../../HOC/withAuth";

function MyReviews() {
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

export const getServerSideProps = withAuthServerSideProps();

export default withAuth(MyReviews);
