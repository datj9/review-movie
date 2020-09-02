import { combineReducers } from "redux";
import userReducer from "./user/reducer";
import movieReducer from "./movie/reducer";

export default combineReducers({
    user: userReducer,
    movie: movieReducer,
});
