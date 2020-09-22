import * as actionTypes from "./action-types";
import BaseAPI from "../api";

const api = new BaseAPI("reviews");

const createReviewStart = () => ({
    type: actionTypes.CREATE_REVIEW_START,
});
const createReviewSuccess = (review) => ({
    type: actionTypes.CREATE_REVIEW_SUCCESS,
    payload: review,
});
export const createReview = (review) => async (dispatch) => {
    dispatch(createReviewStart());
    const { data, ok } = await api.post("", review);

    if (ok) {
        dispatch(createReviewSuccess(data));
    }
};

export const getMyReviews = () => async (dispatch) => {
    dispatch({
        type: actionTypes.GET_MY_REVIEW_START,
    });

    const { data, ok } = await api.get("my-reviews");

    if (ok) {
        dispatch({
            type: actionTypes.GET_MY_REVIEW_SUCCESS,
            payload: data,
        });
    }
};
