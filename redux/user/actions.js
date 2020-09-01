import * as actionTypes from "./action-types";
import BaseAPI from "../api";

const api = new BaseAPI("auth");

const setUser = (user) => ({
    type: actionTypes.SET_USER,
    payload: user,
});

const loginStart = (loginType) => ({
    type: actionTypes.LOGIN_START,
    payload: { loginType },
});
const loginSuccess = () => ({
    type: actionTypes.LOGIN_SUCCESS,
});
const loginFail = () => ({
    type: actionTypes.LOGIN_FAILURE,
});

export const login = (user, loginType) => async (dispatch) => {
    if (loginType === "local") {
        dispatch(loginStart(loginType));

        const { data, ok } = await api.post("login", user);

        if (ok) {
            dispatch(loginSuccess());
        } else {
            dispatch(loginFail());
        }
    } else {
        dispatch(loginStart(loginType));
    }
};
