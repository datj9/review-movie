import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    reviewsList: [],
    isSuccess: false,
    isLoading: false,
    loaded: false,
};

export default function ReviewReducer(state = INITIAL_STATE, action) {
    const { payload } = action;

    switch (action.type) {
        case actionTypes.CREATE_REVIEW_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.CREATE_REVIEW_SUCCESS:
            return {
                ...state,
                isLoading: false,
                reviewsList: [payload].concat[state.reviewsList],
                isSuccess: true,
            };
        case actionTypes.CLEAN_UP:
            return {
                ...state,
                isLoading: false,
                isSuccess: false,
                loaded: false,
            };
        case actionTypes.UPDATE_REVIEWS_LIST:
            return {
                ...state,
                reviewsList: payload,
            };
        case actionTypes.GET_MY_REVIEW_START:
            return {
                ...state,
                isLoading: true,
                reviewsList: [],
            };
        case actionTypes.GET_MY_REVIEW_SUCCESS:
            return {
                ...state,
                isLoading: false,
                loaded: true,
                reviewsList: payload,
            };
        default:
            return state;
    }
}
