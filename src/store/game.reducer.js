// @ts-check
import {
	exploreAndOpenAdjacentTiles,
	findAndOpenNextMine,
	getBoardDimensions,
	getNumberOfMines,
	checkUserWon,
	prepareBoard
} from "../business/game";
import { mine, tile } from "../constants";

import { resetStats, stopUpdatingStats, userAction } from "./stats.reducer";

/***********/
/* Actions */
/***********/

const GAME_PREPARED = "[GAME] GAME_PREPARED";
const UPDATE_TILES = "[GAME] UPDATE_TILES";
const UPDATE_AVAILABLE_FLAGS = "[GAME] UPDATE_AVAILABLE_FLAGS";
const UPDATE_USER_LOST = "[GAME] UPDATE_USER_LOST";
const UPDATE_USER_WON = "[GAME] UPDATE_USER_WON";
const SAVE_INTERVAL_HANDLE = "[GAME] SAVE_INTERVAL_HANDLE";
const UPDATE_REVEAL_TIMEOUT = "[GAME] UPDATE_REVEAL_TIMEOUT";

/*******************/
/* Action Creators */
/*******************/

export const incrementAvailableFlags = () => (dispatch, getState) => {
	const state = getState();
	const { numberOfAvailableFlags } = state.game;
	dispatch({ type: UPDATE_AVAILABLE_FLAGS, payload: numberOfAvailableFlags + 1 });
};

export const decrementAvailableFlags = () => (dispatch, getState) => {
	const state = getState();
	const { numberOfAvailableFlags } = state.game;
	dispatch({ type: UPDATE_AVAILABLE_FLAGS, payload: numberOfAvailableFlags - 1 });
};

export const updateRevealTimeout = (r, c, timeout) => ({
	type: UPDATE_REVEAL_TIMEOUT,
	payload: { r, c, timeout }
});

/********************/
/* Enhanced Actions */
/********************/

export const setupNewGame = () => (dispatch, getState) => {
	const state = getState();
	const { game } = state;
	clearInterval(game.interval);
	dispatch(resetStats());
	const { rows, columns } = getBoardDimensions();
	const numberOfMines = getNumberOfMines();
	const numberOfAvailableFlags = numberOfMines;
	const board = prepareBoard();
	const tiles = [...new Array(rows)].map(() => new Array(columns).fill(tile.unexplored));
	const revealTimeouts = [...new Array(rows)].map(() => new Array(columns).fill(null));
	const gameState = {
		rows,
		columns,
		numberOfMines,
		board,
		numberOfAvailableFlags,
		tiles,
		revealTimeouts
	};
	const payload = Object.assign({}, initialState, gameState);
	dispatch({ type: GAME_PREPARED, payload: payload });
};

export const openTile = (row, column) => (dispatch, getState) => {
	let state;
	dispatch(userAction());
	state = getState();
	const { tiles, board } = state.game;
	// If the tile is already explored, do not do anything
	if (tiles[row][column] === tile.explored) return;
	// If the tile is flagged, do not do anything
	if (tiles[row][column] === tile.flagged) return;
	// Explore the current tile and if needed, open the adjacent ones too.
	// In case if the current tile is not touching any tiles with a mine
	// (meaning that the board content is 0) then we need to keep exploring
	// the adjacent tiles till we find a tile which is touching a mine. ( board with non zero content )
	// This function changes the `tiles` in place.
	exploreAndOpenAdjacentTiles(board, tiles, row, column);
	dispatch({ type: UPDATE_TILES, payload: tiles });
	// The game is over when user explores a tile which had a mine underneath.
	if (board[row][column] === mine) {
		dispatch(stopUpdatingStats());
		dispatch({ type: UPDATE_USER_LOST, payload: true });
		// When the game is over, we need to explore each and every mine on the board slowly
		return dispatch(slowlyOpenNextMine());
	}
	// With this tile opened, it might be possible that the user has won the game
	// We say user has won the game when each and every mine on the board is flagged.
	dispatch(checkAndUpdateIfUserWon());
};

export const flagTile = (row, column) => (dispatch, getState) => {
	dispatch(userAction());
	const state = getState();
	const { tiles } = state.game;
	if (tiles[row][column] === tile.unexplored) {
		tiles[row][column] = tile.flagged;
		dispatch({ type: UPDATE_TILES, payload: tiles });
		dispatch(decrementAvailableFlags());
		// When the user flags a tile, it might be possible that he has won
		dispatch(checkAndUpdateIfUserWon());
	}
};

export const unFlagTile = (row, column) => (dispatch, getState) => {
	dispatch(userAction());
	const state = getState();
	const { tiles } = state.game;
	if (tiles[row][column] === tile.flagged) {
		tiles[row][column] = tile.unexplored;
		dispatch({ type: UPDATE_TILES, payload: tiles });
		dispatch(incrementAvailableFlags());
	}
};

export const checkAndUpdateIfUserWon = () => (dispatch, getState) => {
	const state = getState();
	const { game } = state;
	const { numberOfAvailableFlags, hasUserLost } = game;
	// Preconditions to win:
	// Number of available flags must be exactly 0
	if (numberOfAvailableFlags === 0 && !hasUserLost && checkUserWon(game.board, game.tiles)) {
		dispatch(stopUpdatingStats());
		dispatch({ type: UPDATE_USER_WON, payload: true });
		dispatch(slowlyOpenNextMine());
	}
};

/**
 * This action is used when the game is over.
 * User might have either won or lost
 *
 * This will slowly open all the mines on the board
 */
export const slowlyOpenNextMine = () => (dispatch, getState) => {
	const interval = setInterval(() => {
		const state = getState();
		const { tiles, board } = state.game;
		const found = findAndOpenNextMine(board, tiles);
		if (!found) {
			clearInterval(interval);
		} else {
			dispatch({ type: UPDATE_TILES, payload: tiles });
		}
	}, 400);
	dispatch({ type: SAVE_INTERVAL_HANDLE, payload: interval });
};

/*****************/
/* Initial State */
/*****************/

const initialState = {
	rows: 0,
	columns: 0,
	numberOfMines: 0,
	board: [],

	numberOfAvailableFlags: 0,
	tiles: [],

	revealTimeouts: [],

	hasUserLost: false,
	hasUserWon: false,
	interval: -1
};

/***********/
/* Reducer */
/***********/

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case GAME_PREPARED: {
			return {
				...state,
				...action.payload
			};
		}
		case UPDATE_TILES: {
			return {
				...state,
				tiles: action.payload
			};
		}
		case UPDATE_AVAILABLE_FLAGS: {
			return {
				...state,
				numberOfAvailableFlags: action.payload
			};
		}
		case UPDATE_USER_LOST: {
			return {
				...state,
				hasUserLost: !!action.payload
			};
		}
		case UPDATE_USER_WON: {
			return {
				...state,
				hasUserWon: !!action.payload
			};
		}
		case SAVE_INTERVAL_HANDLE: {
			return {
				...state,
				interval: action.payload
			};
		}
		case UPDATE_REVEAL_TIMEOUT: {
			const revealTimeouts = state.revealTimeouts;
			const { r, c, timeout } = action.payload;
			revealTimeouts[r][c] = timeout;
			return {
				...state,
				revealTimeouts: [...revealTimeouts]
			};
		}
		default:
			return state;
	}
}
