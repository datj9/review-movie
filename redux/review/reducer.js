import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    reviewsList: [],
    isSuccess: false,
    isLoading: false,
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
            };
        default:
            return state;
    }
}
