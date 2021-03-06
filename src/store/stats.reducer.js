import { getMaxScore, getNextScore } from "../business/game";

/***********/
/* Actions */
/***********/

const UPDATE_GAME_STATS = "[STATS] UPDATE_GAME_STATS";
const SAVE_INTERVAL_HANDLE = "[STATS] SAVE_INTERVAL_HANDLE";
const RESET = "[STATS] RESET";

/*******************/
/* Action Creators */
/*******************/

export const resetStats = () => dispatch => {
	dispatch({ type: RESET });
};

/********************/
/* Enhanced Actions */
/********************/

export const stopUpdatingStats = () => (_, getState) => {
	const store = getState();
	const { interval } = store.stats;
	clearInterval(interval);
};

export const userAction = () => (dispatch, getState) => {
	const store = getState();
	const { interval } = store.stats;
	if (interval === -1) {
		const interval = setInterval(() => {
			const store = getState();
			const { timeTaken, score } = store.stats;
			const nextScore = getNextScore({ score, time: timeTaken });
			const payload = { timeTaken: timeTaken + 1, score: nextScore };
			dispatch({ type: UPDATE_GAME_STATS, payload });
		}, 1000);
		dispatch({ type: SAVE_INTERVAL_HANDLE, payload: interval });
	}
};

/*****************/
/* Initial State */
/*****************/

const initialState = {
	interval: -1,
	timeTaken: 0,
	score: getMaxScore()
};

/***********/
/* Reducer */
/***********/

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case UPDATE_GAME_STATS: {
			return {
				...state,
				...action.payload
			};
		}
		case SAVE_INTERVAL_HANDLE: {
			return {
				...state,
				interval: action.payload
			};
		}
		case RESET: {
			clearInterval(state.interval);
			return { ...initialState };
		}
		default:
			return state;
	}
}
