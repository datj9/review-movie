import { combineReducers } from "redux";
import reviewReducer from "./review/reducer";
import userReducer from "./user/reducer";

export default combineReducers({
    user: userReducer,
    review: reviewReducer,
});
