import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import "./GameStats.scss";
function GameStats(props) {
	const { game, stats } = props;
	const { numberOfMines, numberOfAvailableFlags } = game;
	const { timeTaken, score } = stats;
	const timeElapsed = new Date(timeTaken * 1000).toISOString().substr(11, 8);

	return (
		<div className="game-stats">
			<div className="game-stats--single" title="Total Mines">
				<div className="stats--number">{numberOfMines}</div>
				<div className="stats--icon">
					<FontAwesomeIcon icon={faBomb} />
				</div>
			</div>
			<div className="game-stats--single" title="Available Flags">
				<div className="stats--number">{numberOfAvailableFlags}</div>
				<div className="stats--icon">
					<FontAwesomeIcon icon={faFlag} />
				</div>
			</div>
			<div className="game-stats--single" title="Time">
				<div className="stats--number">{timeElapsed}</div>
				<div className="stats--icon">
					<FontAwesomeIcon icon={faStopwatch} />
				</div>
			</div>
			<div className="game-stats--single" title="Score">
				<div className="stats--number">{Math.floor(score)}</div>
				<div className="stats--icon">
					<FontAwesomeIcon icon={faStar} />
				</div>
			</div>
		</div>
	);
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, {})(GameStats);
