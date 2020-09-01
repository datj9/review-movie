import { createStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import thunk from "redux-thunk";
import rootReducer from "./root-reducer";

// create a makeStore function
const makeStore = (context) => createStore(rootReducer, applyMiddleware(thunk));

// export an assembled wrapper
export const wrapper = createWrapper(makeStore, { debug: true });
