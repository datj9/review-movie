import Star from "@material-ui/icons/Star";
import StarBorderOutlined from "@material-ui/icons/StarBorderOutlined";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
import "dayjs/locale/vi";

dayjs.locale("vi");
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export default function ReviewItem({ review, name, displayAvatar }) {
    return (
        <div className='review-item mb-4 py-2 px-4'>
            <div className='header-review-item is-flex'>
                {displayAvatar ? (
                    <div className='avatar mr-2 is-flex'>
                        {review.user.image ? (
                            <span className='is-block'>
                                <img src={review.user.image} />
                            </span>
                        ) : (
                            <span className='name-icon is-flex has-text-white'>Đ</span>
                        )}
                    </div>
                ) : null}
                <div className='name-and-time is-flex'>
                    <span className='has-text-black'>{name}</span>
                    <span className='has-text-black'>
                        {Date.now() - new Date(review.createdAt).getTime() >= 3 * 24 * 60 * 60 * 1000
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

            <style jsx>
                {`
                    .review-item {
                        border: 1px solid #e8e8e8;
                        border-radius: 3px;
                    }
                    .review-text {
                        white-space: pre-wrap;
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
                `}
            </style>
        </div>
    );
}
