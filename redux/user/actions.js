import * as actionTypes from "./action-types";
import BaseAPI from "../api";

const api = new BaseAPI("auth");

const loginStart = (loginType) => ({
    type: actionTypes.LOGIN_START,
    payload: {
        loginType,
    },
});
const loginSuccess = () => ({
    type: actionTypes.LOGIN_SUCCESS,
});
const loginFail = (errors) => ({
    type: actionTypes.LOGIN_FAILURE,
    payload: errors,
});

export const login = (user, loginType) => async (dispatch) => {
    dispatch(loginStart(loginType));

    if (loginType === "local") {
        const { data, ok } = await api.post("login", user);

        if (ok) {
            dispatch(loginSuccess());
        } else {
            dispatch(loginFail(data));
        }
    }
};

export const register = (user) => async (dispatch) => {
    dispatch({
        type: actionTypes.REGISTER_START,
    });

    const { data, ok } = await api.post("register", user);

    if (ok) {
        dispatch({
            type: actionTypes.REGISTER_SUCCESS,
        });
    } else {
        dispatch({
            type: actionTypes.REGISTER_FAILURE,
            payload: data,
        });
    }
};

export const logout = () => async (dispatch) => {
    dispatch({
        type: actionTypes.LOGOUT_START,
    });
    const res = await api.get("logout");
    if (res.ok) {
        dispatch({
            type: actionTypes.LOGOUT_SUCCESS,
        });
    }
};

export const setUser = (user) => ({
    type: actionTypes.SET_USER,
    payload: user,
});

export const reqSendEmail = (email) => async (dispatch) => {
    dispatch({
        type: actionTypes.REQ_SEND_EMAIL_START,
    });

    const { data, ok } = await api.post("send-email", { email });
    if (ok) {
        dispatch({
            type: actionTypes.REQ_SEND_EMAIL_SUCCESS,
            payload: data.exp,
        });
    } else {
        dispatch({
            type: actionTypes.REQ_SEND_EMAIL_FAILURE,
            payload: data,
        });
    }
};

export const confirmToken = (token, email) => async (dispatch) => {
    dispatch({
        type: actionTypes.CONFIRM_EMAIL_START,
    });
    const { data, ok } = await api.post("verify-token", { token, email });
    if (ok) {
        dispatch({
            type: actionTypes.CONFIRM_EMAIL_SUCCESS,
        });
    } else {
        dispatch({
            type: actionTypes.CONFIRM_EMAIL_FAILURE,
            payload: data,
        });
    }
};

export const changePasswordByVerifyingEmail = (userData) => async (dispatch) => {
    dispatch({
        type: actionTypes.CHANGE_PASSWORD_START,
    });

    const { data, ok } = await api.post("change-password-by-email", userData);
    if (ok) {
        dispatch({
            type: actionTypes.CHANGE_PASSWORD_SUCCESS,
        });
    } else {
        dispatch({
            type: actionTypes.CHANGE_PASSWORD_FAILURE,
            payload: data,
        });
    }
};
