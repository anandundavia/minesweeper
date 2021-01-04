//@ts-check
import React from "react";
import { connect } from "react-redux";

import GameStats from "../../components/GameStats/GameStats";
import Tile from "../../components/Tile/Tile";

import { flagTile, openTile, setupNewGame, unFlagTile } from "../../store/game.reducer";

import { tile } from "../../constants";

import "./GameBoard.scss";

class GameBoard extends React.Component {
	/**
	 * @override
	 */
	componentDidMount() {
		this.props.setupNewGame();
	}

	openTile = (r, c) => {
		r = Number.parseInt(r, 10);
		c = Number.parseInt(c, 10);
		const { tiles } = this.props.game;
		if (tiles[r][c] !== tile.explored) {
			this.props.openTile(r, c);
		}
	};

	toggleFlagOnTile = (r, c) => {
		r = Number.parseInt(r, 10);
		c = Number.parseInt(c, 10);
		const { tiles } = this.props.game;
		switch (tiles[r][c]) {
			case tile.flagged: {
				return this.props.unFlagTile(r, c);
			}
			case tile.unexplored: {
				return this.props.flagTile(r, c);
			}
			default: {
			}
		}
	};

	onTileLeftClick = e => {
		const r = e.currentTarget.getAttribute("data-tile-r");
		const c = e.currentTarget.getAttribute("data-tile-c");
		this.openTile(r, c);
	};

	onTileRightClick = e => {
		e.preventDefault(); // so as to not open the right click options
		const r = e.currentTarget.getAttribute("data-tile-r");
		const c = e.currentTarget.getAttribute("data-tile-c");
		this.toggleFlagOnTile(r, c);
		navigator.vibrate(100);
	};

	renderCell = (r, c) => {
		const { game } = this.props;
		const { tiles, board, hasUserLost, hasUserWon } = game;

		const props = {
			"data-tile-r": r,
			"data-tile-c": c,
			theTile: tiles[r][c],
			theCell: board[r][c],
			isGameOver: hasUserLost || hasUserWon,
			onClick: this.onTileLeftClick,
			onContextMenu: this.onTileRightClick
		};

		return <Tile {...props} />;
	};

	renderGameStats() {
		return (
			<div className="stats">
				<GameStats />
			</div>
		);
	}

	renderGameControlsTip() {
		const hasGameStarted = this.props.stats.interval !== -1;
		const hasTouchInput = window.matchMedia("(pointer: coarse)").matches;
		const primary = hasTouchInput ? "tap" : "click";
		const secondary = hasTouchInput ? "long tap" : "right click";
		return (
			<div className={`controls-tip ${hasGameStarted ? "hide" : ""}`}>
				<span>{primary} to reveal.</span> <span>{secondary} to flag.</span>
			</div>
		);
	}

	renderBoard() {
		const { game } = this.props;
		const { tiles } = game;

		return (
			<div className="board">
				{tiles.map((aRow, r) => (
					<div className="board-row">{aRow.map((_, c) => this.renderCell(r, c))}</div>
				))}
			</div>
		);
	}

	/**
	 * @override
	 */
	render() {
		return (
			<div className="game-board">
				{this.renderGameStats()}
				{this.renderGameControlsTip()}
				{this.renderBoard()}
			</div>
		);
	}
}

const mapStateToProps = state => state;
const mapDispatchToProps = {
	setupNewGame,
	openTile,
	flagTile,
	unFlagTile
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
