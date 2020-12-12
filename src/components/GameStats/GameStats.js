import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import { setupNewGame } from "../../store/game.reducer";

import "./GameStats.scss";

function GameStats(props) {
	function onRestartClick() {
		props.setupNewGame();
	}

	const { game, stats } = props;
	const { numberOfMines, numberOfAvailableFlags, hasUserLost, hasUserWon } = game;
	const { timeTaken, score } = stats;
	const timeElapsed = new Date(timeTaken * 1000).toISOString().substr(11, 8);

	function renderWhenUserLost() {
		return (
			<div className="game-stats">
				<div className="game-stats--single " title="You Lost!">
					<div className="stats--icon user-lost">
						<FontAwesomeIcon icon={faHeartBroken} />
					</div>
					<div className="stats--number">You Lost!</div>
				</div>
				<div className="game-stats--single cta" title="Restart" onClick={onRestartClick}>
					<div className="stats--icon">
						<FontAwesomeIcon icon={faRedo} />
					</div>
					<div className="stats--number">Restart</div>
				</div>
				<div className="game-stats--single" title="Score and Time">
					<div className="stats--icon">
						<FontAwesomeIcon icon={faStar} />
					</div>
					<div className="stats--number">
						{Math.floor(score)} / {timeElapsed}
					</div>
				</div>
			</div>
		);
	}

	function renderWhenUserWon() {
		return (
			<div className="game-stats">
				<div className="game-stats--single " title="You Won!">
					<div className="stats--icon user-won">
						<FontAwesomeIcon icon={faHeart} />
					</div>
					<div className="stats--number">You Won!</div>
				</div>
				<div className="game-stats--single cta" title="Restart" onClick={onRestartClick}>
					<div className="stats--icon">
						<FontAwesomeIcon icon={faRedo} />
					</div>
					<div className="stats--number">Restart</div>
				</div>
				<div className="game-stats--single" title="Score and Time">
					<div className="stats--icon">
						<FontAwesomeIcon icon={faStar} />
					</div>
					<div className="stats--number">
						{Math.floor(score)} / {timeElapsed}
					</div>
				</div>
			</div>
		);
	}

	if (hasUserLost) {
		return renderWhenUserLost();
	}

	if (hasUserWon) {
		return renderWhenUserWon();
	}

	return (
		<div className="game-stats">
			<div className="game-stats--single" title="Total Mines">
				<div className="stats--icon">
					<FontAwesomeIcon icon={faBomb} />
				</div>
				<div className="stats--number">{numberOfMines}</div>
			</div>

			<div className="game-stats--single" title="Available Flags">
				<div className="stats--icon">
					<FontAwesomeIcon icon={faFlag} />
				</div>
				<div className="stats--number">{numberOfAvailableFlags}</div>
			</div>
			<div className="game-stats--single" title="Time">
				<div className="stats--icon">
					<FontAwesomeIcon icon={faStopwatch} />
				</div>
				<div className="stats--number">{timeElapsed}</div>
			</div>
			<div className="game-stats--single" title="Score">
				<div className="stats--icon">
					<FontAwesomeIcon icon={faStar} />
				</div>
				<div className="stats--number">{Math.floor(score)}</div>
			</div>
		</div>
	);
}

const mapStateToProps = state => state;
const mapDispatchToProps = {
	setupNewGame
};

export default connect(mapStateToProps, mapDispatchToProps)(GameStats);
