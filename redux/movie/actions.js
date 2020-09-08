// import * as actionTypes from "./action-types";
// import BaseAPI from "../api";

// const api = new BaseAPI("movies");

// export const getListMovies = (pageIndex,movieId,theaterId) => async (dispatch) => {
//     dispatch({
//         type: actionTypes.GET_LIST_MOVIES_START,
//     });

//     const { data, ok } = await api.get(`?${movieId ? `movieId=${movieId}` : `theaterId=${theaterId}`}&pageIndex=${pageIndex}`);

//     if (ok) {
//         dispatch({
//             type: actionTypes.GET_LIST_MOVIES_SUCCESS,
//             payload: data,
//         });
//     }
// };
