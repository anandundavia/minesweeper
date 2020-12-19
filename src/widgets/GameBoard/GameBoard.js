//@ts-check
import React from "react";
import { connect } from "react-redux";

import GameStats from "../../components/GameStats/GameStats";
import Tile from "../../components/Tile/Tile";

import { flagTile, openTile, setupNewGame, unFlagTile } from "../../store/game.reducer";

import { tile } from "../../constants";

import "./GameBoard.scss";

class GameBoard extends React.Component {
	constructor(props) {
		super(props);
		this.hasTouchInput = window.matchMedia("(pointer: coarse)").matches;
	}

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

	onTileTouch = e => {
		const r = e.currentTarget.getAttribute("data-tile-r");
		const c = e.currentTarget.getAttribute("data-tile-c");
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
			this.toggleFlagOnTile(r, c);
		}
		this.timeout = setTimeout(() => {
			this.timeout = null;
			this.openTile(r, c);
		}, 250);
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
	};

	renderCell = (r, c) => {
		const { game } = this.props;
		const { tiles, board, hasUserLost, hasUserWon } = game;

		const onClick = this.hasTouchInput ? this.onTileTouch : this.onTileLeftClick;

		const props = {
			"data-tile-r": r,
			"data-tile-c": c,
			theTile: tiles[r][c],
			theCell: board[r][c],
			isGameOver: hasUserLost || hasUserWon,
			onClick: onClick,
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
