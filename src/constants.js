// @ts-check

export const board = { rows: 8, columns: 6 };

board.numberOfMines = Math.ceil(
	(Math.sqrt(board.rows) + Math.sqrt(board.columns)) / 2 + Math.sqrt(board.rows * board.columns)
);
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
