// @ts-check
import {
	exploreAndOpenAdjacentTiles,
	findAndOpenNextMine,
	getBoardDimensions,
	getNumberOfMines,
	prepareBoard
} from "../business/game";
import { mine, tile } from "../constants";

import { stopUpdatingStats, userAction } from "./stats.reducer";

const GAME_PREPARED = "[GAME] GAME_PREPARED";
const UPDATE_TILES = "[GAME] UPDATE_TILES";
const UPDATE_AVAILABLE_FLAGS = "[GAME] UPDATE_AVAILABLE_FLAGS";
const UPDATE_MINE_REVEALED = "[GAME] UPDATE_MINE_REVEALED";

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
	const { rows, columns } = getBoardDimensions();
	const numberOfMines = getNumberOfMines();
	const numberOfAvailableFlags = numberOfMines;
	const board = prepareBoard();
	const tiles = [...new Array(rows)].map(() => new Array(columns).fill(tile.unexplored));
	const payload = { rows, columns, numberOfMines, board, numberOfAvailableFlags, tiles };
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
		let interval = setInterval(() => {
			const state = getState();
			const { tiles, board } = state.game;
			const found = findAndOpenNextMine(board, tiles);
			if (!found) {
				clearInterval(interval);
			} else {
				dispatch({ type: UPDATE_TILES, payload: tiles });
			}
		}, 400);
		return;
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

	isAMineRevealed: false
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
		default:
			return state;
	}
}
