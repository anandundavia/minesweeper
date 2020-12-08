// @ts-check

const aspectRatio = window.innerWidth / window.innerHeight;
const multiplier = Math.max(aspectRatio, 1 / aspectRatio);

export const board = { rows: 8 };
board.columns = Math.floor((board.rows * multiplier) / 2);
board.numberOfMines = Math.ceil((3 / multiplier) * Math.sqrt(board.rows * board.columns));

board.numberOfMines & 1 && board.numberOfMines++;

export const tile = {
	unexplored: 0,
	explored: 1,
	flagged: 2,
	successfullyPredicted: 3,
	wronglyPredicted: 4
};

export const mine = 10;

export const maxScore = 100;
