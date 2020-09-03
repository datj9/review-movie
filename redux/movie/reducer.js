import { HYDRATE } from "next-redux-wrapper";
import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    isLoading: false,
    movies: {},
};

export default function userReducer(state = INITIAL_STATE, action) {
    const { payload } = action;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload);
            const wasBumpedOnClient = stateDiff?.page?.[0]?.endsWith("X");

            return { ...state, ...action.payload, page: wasBumpedOnClient ? state.page : action.payload.page };
        case actionTypes.GET_LIST_MOVIES_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.GET_LIST_MOVIES_SUCCESS:
            return {
                ...state,
                isLoading: false,
                movies: payload,
            };
        default:
            return state;
    }
}
