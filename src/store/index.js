// @ts-check
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import gameReducer from "./game.reducer";
import statsReducer from "./stats.reducer";

const allReducers = combineReducers({
	game: gameReducer,
	stats: statsReducer
});

const initialState = {};

const enhancers = [];
const middleware = [thunk];

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export const store = createStore(allReducers, initialState, composedEnhancers);
