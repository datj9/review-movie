import { HYDRATE } from "next-redux-wrapper";
import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    isLoading: false,
    loginType: "",
    errors: {},
    currentUser: {},
    isAuthenticated: false,
    message: "",
};

export default function userReducer(state = INITIAL_STATE, action) {
    const { payload } = action;

    switch (action.type) {
        case HYDRATE:
            const stateDiff = diff(state, action.payload);
            const wasBumpedOnClient = stateDiff?.page?.[0]?.endsWith("X");

            return { ...state, ...action.payload, page: wasBumpedOnClient ? state.page : action.payload.page };
        case actionTypes.LOGIN_START:
            console.log(payload);
            return { ...state, isLoading: true, loginType: payload.loginType, errors: {} };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                loginType: "",
                isAuthenticated: true,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                loginType: "",
                errors: payload,
            };
        case actionTypes.REGISTER_START:
            return { ...state, isLoading: true, errors: {} };
        case actionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: true,
            };
        case actionTypes.REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                errors: payload,
            };
        case actionTypes.LOGOUT_START:
            return {
                ...state,
                isLoading: true,
            };
        case actionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false,
                currentUser: {},
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                isAuthenticated: true,
                currentUser: payload,
            };
        case actionTypes.CLEAN_UP:
            return {
                ...state,
                errors: {},
                message: "",
                isLoading: false,
            };
        default:
            return state;
    }
}
