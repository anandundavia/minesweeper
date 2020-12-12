// @ts-check

import { board, maxScore, mine, tile } from "../constants";

export const generateMines = () => {
	const { rows, columns, numberOfMines } = board;
	let numberOfMinesPlanted = 0;
	const mines = [...new Array(rows)].map(() => new Array(columns).fill(false));

	while (numberOfMinesPlanted < numberOfMines) {
		let filled = false;
		do {
			const r = Math.floor(Math.random() * rows);
			const c = Math.floor(Math.random() * columns);
			if (mines[r][c] !== true) {
				mines[r][c] = true;
				filled = true;
				numberOfMinesPlanted++;
			}
		} while (!filled);
	}

	return mines;
};

const DR = [-1, -1, -1, 0, 1, 1, 1, 0];
const DC = [-1, 0, 1, 1, 1, 0, -1, -1];

export const prepareBoard = () => {
	const mines = generateMines();
	const { rows, columns } = board;
	const gameBoard = [...new Array(rows)].map(() => new Array(columns).fill(0));

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (mines[i][j]) {
				gameBoard[i][j] = mine;
				continue;
			}

			for (let k = 0; k < DR.length; k++) {
				const nr = i + DR[k];
				const nc = j + DC[k];
				if (!(0 <= nr && nr < rows)) continue;
				if (!(0 <= nc && nc < columns)) continue;
				if (mines[nr][nc]) gameBoard[i][j]++;
			}
		}
	}

	return gameBoard;
};

export const getBoardDimensions = () => {
	const { rows, columns } = board;
	return { rows, columns };
};

export const getNumberOfMines = () => board.numberOfMines;

export const getMaxScore = () => maxScore;

export const getNextScore = ({ time, score }) => score - 1 / (1 + (time * time) / score);

export const exploreAndOpenAdjacentTiles = (gameBoard, tiles, r, c) => {
	const { rows, columns } = board;
	if (tiles[r][c] !== tile.unexplored) return;
	tiles[r][c] = tile.explored;
	if (gameBoard[r][c] !== 0) return;
	for (let k = 0; k < DR.length; k++) {
		const nr = r + DR[k];
		const nc = c + DC[k];
		if (!(0 <= nr && nr < rows)) continue;
		if (!(0 <= nc && nc < columns)) continue;
		if (gameBoard[nr][nc] === 0) {
			exploreAndOpenAdjacentTiles(gameBoard, tiles, nr, nc);
		} else if (gameBoard[nr][nc] !== mine && tiles[nr][nc] !== tile.flagged) {
			tiles[nr][nc] = tile.explored;
		}
	}
};

export const findAndOpenNextMine = (gameBoard, tiles) => {
	const { rows, columns } = board;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (gameBoard[i][j] === mine && tiles[i][j] === tile.unexplored) {
				tiles[i][j] = tile.explored;
				return true;
			}
			if (gameBoard[i][j] === mine && tiles[i][j] === tile.flagged) {
				tiles[i][j] = tile.successfullyPredicted;
				return true;
			}
			if (gameBoard[i][j] !== mine && tiles[i][j] === tile.flagged) {
				tiles[i][j] = tile.wronglyPredicted;
				return true;
			}
		}
	}
	return false;
};

export const checkUserWon = (gameBoard, tiles) => {
	console.log({ gameBoard, tiles });
	const { rows, columns } = board;
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < columns; j++) {
			if (gameBoard[i][j] === mine && tiles[i][j] !== tile.flagged) {
				return false;
			}
		}
	}
	return true;
};
