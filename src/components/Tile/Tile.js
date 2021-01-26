// @ts-check
import React from "react";

import PropTypes from "prop-types";
import { mine, tile } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faSmileBeam } from "@fortawesome/free-solid-svg-icons";
import { faFrown } from "@fortawesome/free-solid-svg-icons";

import "./Tile.scss";

/**
 * State of tiles:
 * When Game is not over:
 * Unexplored State -> User has not yet either flagged / explored the tile.
 * Flagged State -> User has flagged the tile.
 * Explored State -> User has removed this tile to uncover the number / mine beneath it.
 *
 * When Game is over:
 * Successfully predicted state -> The mine was correctly flagged.
 * Unsuccessfully predicted state -> User wrongly thought there was a mine.
 * @param {*} props
 */
export default function Tile(props) {
	function successfullyPredictedMine() {
		return (
			<div className="mine mine--successfully-predicted" {...props}>
				<FontAwesomeIcon icon={faSmileBeam} />
			</div>
		);
	}

	function wronglyPredictedMine() {
		return (
			<div className="mine mine--wrongly-predicted" {...props}>
				<FontAwesomeIcon icon={faFrown} />
			</div>
		);
	}

	function flaggedMine() {
		return (
			<div className="mine mine--flagged" {...props}>
				<FontAwesomeIcon icon={faBomb} />
			</div>
		);
	}

	function exploredMine() {
		const { theCell } = props;
		if (theCell === 0) return <div className="mine mine--explored" {...props}></div>;
		if (theCell === mine) {
			return (
				<div className="mine mine--blasted" {...props}>
					<span>
						<FontAwesomeIcon icon={faBomb} />
					</span>
				</div>
			);
		}
		return (
			<div className="mine mine--explored" {...props}>
				{theCell}
			</div>
		);
	}

	function unexploredMine() {
		const revealClass = props.revealAnimation ? "mine--revealing" : "";
		return <div className={`mine ${revealClass}`} {...props}></div>;
	}

	function renderMine() {
		const { theTile } = props;
		if (theTile === tile.flagged) {
			return flaggedMine();
		}
		if (theTile === tile.explored) {
			return exploredMine();
		}
		return unexploredMine();
	}

	function renderWhenGameOver() {
		const { theTile } = props;

		if (theTile === tile.successfullyPredicted) {
			return successfullyPredictedMine();
		}

		if (theTile === tile.wronglyPredicted) {
			return wronglyPredictedMine();
		}

		return renderMine();
	}

	if (props.isGameOver) {
		return renderWhenGameOver();
	}
	return renderMine();
}

Tile.propTypes = {
	theTile: PropTypes.number.isRequired,
	theCell: PropTypes.number.isRequired,
	isGameOver: PropTypes.bool,
	revealAnimation: PropTypes.bool
};

Tile.defaultProps = {
	isGameOver: false,
	revealAnimation: false
};
