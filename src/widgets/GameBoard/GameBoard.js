//@ts-check
import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import { faSmileBeam } from "@fortawesome/free-solid-svg-icons";

import GameStats from "../../components/GameStats/GameStats";
import { flagTile, openTile, setupNewGame, unFlagTile } from "../../store/game.reducer";

import { mine, tile } from "../../constants";

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
		const { tiles } = this.props.game;
		if (tiles[r][c] !== tile.explored) {
			this.props.openTile(r, c);
		}
	};

	toggleFlagOnTile = (r, c) => {
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

	// TODO
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
		const { tiles, board, isMineRevealed } = game;

		const onClick = this.hasTouchInput ? this.onTileTouch : this.onTileLeftClick;
		const props = {
			"data-tile-r": r,
			"data-tile-c": c,
			onClick: onClick,
			onContextMenu: this.onTileRightClick
		};

		if (isMineRevealed && tiles[r][c] === tile.flagged && board[r][c] !== mine) {
			return (
				<div className="board-cell wrong-mine" {...props}>
					<FontAwesomeIcon icon={faFrown} />
				</div>
			);
		}
		if (tiles[r][c] === tile.flagged) {
			return (
				<div className="board-cell flagged" {...props}>
					<FontAwesomeIcon icon={faBomb} />
				</div>
			);
		}
		if (tiles[r][c] === tile.explored) {
			return (
				<div className="board-cell explored" {...props}>
					{board[r][c] !== 0 ? (
						board[r][c] === mine ? (
							<span className="explored-mine">
								<FontAwesomeIcon icon={faBomb} />
							</span>
						) : (
							board[r][c]
						)
					) : undefined}
				</div>
			);
		}
		if (tiles[r][c] === tile.defused) {
			return (
				<div className="board-cell defused" {...props}>
					<FontAwesomeIcon icon={faSmileBeam} />
				</div>
			);
		}

		return (
			<div className="board-cell cheat" {...props}>
				{/* {board[r][c]} */}
			</div>
		);
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
