import * as actionTypes from "./action-types";
import BaseAPI from "../api";

const api = new BaseAPI("auth");

const loginStart = (loginType) => ({
    type: actionTypes.LOGIN_START,
    payload: { loginType },
});
const loginSuccess = () => ({
    type: actionTypes.LOGIN_SUCCESS,
});
const loginFail = (errors) => ({
    type: actionTypes.LOGIN_FAILURE,
    payload: errors,
});

export const login = (user, loginType) => async (dispatch) => {
    if (loginType === "local") {
        dispatch(loginStart(loginType));

        const { data, ok } = await api.post("login", user);

        if (ok) {
            dispatch(loginSuccess());
        } else {
            dispatch(loginFail(data));
        }
    } else {
        dispatch(loginStart(loginType));
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
