import { combineReducers } from "redux";
import ReviewReducer from "./review/reducer";
import userReducer from "./user/reducer";
// import movieReducer from "./movie/reducer";

export default combineReducers({
    user: userReducer,
    review: ReviewReducer,
    // movie: movieReducer,
});
