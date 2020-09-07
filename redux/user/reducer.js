import { HYDRATE } from "next-redux-wrapper";
import * as actionTypes from "./action-types";

const INITIAL_STATE = {
    server: {
        currentUser: {},
        isAuthenticated: false,
    },
    client: {
        isLoading: false,
        loginType: "",
        errors: {},
        message: "",
        isSuccess: false,
        exp: 0,
    },
};

export default function userReducer(state = INITIAL_STATE, action) {
    const { payload } = action;

    switch (action.type) {
        case HYDRATE:
            return {
                ...state,
                server: {
                    ...state.server,
                    ...action.payload.server,
                },
            };
        case actionTypes.LOGIN_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                    loginType: payload.loginType,
                    errors: {},
                },
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    loginType: "",
                    isSuccess: true,
                },
                server: {
                    ...state.server,
                    isAuthenticated: true,
                },
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    loginType: "",
                    errors: payload,
                },
            };
        case actionTypes.REGISTER_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                    errors: {},
                },
            };
        case actionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    isSuccess: true,
                },
                server: {
                    ...state.server,
                    isAuthenticated: true,
                },
            };
        case actionTypes.REGISTER_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    errors: payload,
                },
            };
        case actionTypes.LOGOUT_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                },
            };
        case actionTypes.LOGOUT_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    isSuccess: true,
                },
                server: {
                    ...state.server,
                    isAuthenticated: false,
                    currentUser: {},
                },
            };
        case actionTypes.LOGOUT_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                },
            };
        case actionTypes.SET_USER:
            return {
                ...state,
                server: {
                    ...state.server,
                    isAuthenticated: true,
                    currentUser: payload,
                },
            };
        case actionTypes.CLEAN_UP:
            return {
                ...state,
                client: {
                    ...state.client,
                    errors: {},
                    message: "",
                    isLoading: false,
                    isSuccess: false,
                    loginType: "",
                },
            };
        case actionTypes.REQ_SEND_EMAIL_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                    errors: {},
                    exp: 0,
                },
            };
        case actionTypes.REQ_SEND_EMAIL_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    isSuccess: true,
                    exp: payload,
                },
            };
        case actionTypes.REQ_SEND_EMAIL_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    errors: payload,
                },
            };
        case actionTypes.CONFIRM_EMAIL_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                    errors: {},
                },
            };
        case actionTypes.CONFIRM_EMAIL_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    isSuccess: true,
                },
            };
        case actionTypes.CONFIRM_EMAIL_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    errors: payload,
                },
            };
        case actionTypes.CHANGE_PASSWORD_START:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: true,
                },
            };
        case actionTypes.CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    isSuccess: true,
                },
            };
        case actionTypes.CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                client: {
                    ...state.client,
                    isLoading: false,
                    errors: payload,
                },
            };
        default:
            return state;
    }
}
