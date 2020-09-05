import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    isLoading: false,
    reviewsList: [],
};

export default function ReviewReducer(state = INITIAL_STATE, action) {
    const { payload } = action;

    switch (action.payload) {
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
            };

        default:
            return state;
    }
}
