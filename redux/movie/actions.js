import * as actionTypes from "./action-types";
import BaseAPI from "../api";

const api = new BaseAPI("movies");

export const getListMovies = () => async (dispatch) => {
    dispatch({
        type: actionTypes.GET_LIST_MOVIES_START,
    });
    const { data, ok } = await api.get("");
    if (ok) {
        dispatch({
            type: actionTypes.GET_LIST_MOVIES_SUCCESS,
            payload: data,
        });
    }
};
