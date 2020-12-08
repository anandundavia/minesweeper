// @ts-check
import {
	exploreAndOpenAdjacentTiles,
	findAndOpenNextMine,
	getBoardDimensions,
	getNumberOfMines,
	prepareBoard
} from "../business/game";
import { mine, tile } from "../constants";

import { resetStats, stopUpdatingStats, userAction } from "./stats.reducer";

const GAME_PREPARED = "[GAME] GAME_PREPARED";
const UPDATE_TILES = "[GAME] UPDATE_TILES";
const UPDATE_AVAILABLE_FLAGS = "[GAME] UPDATE_AVAILABLE_FLAGS";
const UPDATE_MINE_REVEALED = "[GAME] UPDATE_MINE_REVEALED";
const SAVE_INTERVAL_HANDLE = "[GAME] SAVE_INTERVAL_HANDLE";

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
	const isAMineRevealed = false;
	const payload = {
		rows,
		columns,
		numberOfMines,
		board,
		numberOfAvailableFlags,
		tiles,
		isAMineRevealed
	};
	dispatch({ type: GAME_PREPARED, payload: payload });
};

export const openTile = (row, column) => (dispatch, getState) => {
	row = Number.parseInt(row, 10);
	column = Number.parseInt(column, 10);
	dispatch(userAction());
	const state = getState();
	const { tiles, board } = state.game;
	if (tiles[row][column] === tile.explored) return;
	exploreAndOpenAdjacentTiles(board, tiles, row, column);
	dispatch({ type: UPDATE_TILES, payload: tiles });
	if (board[row][column] === mine) {
		dispatch(stopUpdatingStats());
		dispatch({ type: UPDATE_MINE_REVEALED, payload: true });
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
	}
};

export const flagTile = (row, column) => (dispatch, getState) => {
	row = Number.parseInt(row, 10);
	column = Number.parseInt(column, 10);
	dispatch(userAction());
	const state = getState();
	const { tiles } = state.game;
	if (tiles[row][column] === tile.unexplored) {
		tiles[row][column] = tile.flagged;
		dispatch({ type: UPDATE_TILES, payload: tiles });
		dispatch(decrementAvailableFlags());
	}
};

export const unFlagTile = (row, column) => (dispatch, getState) => {
	row = Number.parseInt(row, 10);
	column = Number.parseInt(column, 10);
	dispatch(userAction());
	const state = getState();
	const { tiles } = state.game;
	if (tiles[row][column] === tile.flagged) {
		tiles[row][column] = tile.unexplored;
		dispatch({ type: UPDATE_TILES, payload: tiles });
		dispatch(incrementAvailableFlags());
	}
};

const initialState = {
	rows: 0,
	columns: 0,
	numberOfMines: 0,
	board: [],

	numberOfAvailableFlags: 0,
	tiles: [],

	isAMineRevealed: false,
	interval: -1
};

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
		case UPDATE_MINE_REVEALED: {
			return {
				...state,
				isAMineRevealed: !!action.payload
			};
		}
		case SAVE_INTERVAL_HANDLE: {
			return {
				...state,
				interval: action.payload
			};
		}
		default:
			return state;
	}
}
