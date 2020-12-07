import "./App.scss";
import GameFooter from "./components/GameFooter/GameFooter";
import GameHeader from "./components/GameHeader/GameHeader";
import GameBoard from "./widgets/GameBoard/GameBoard";

function App() {
	return (
		<div className="app-container">
			<GameHeader />
			<GameBoard />
			<GameFooter />
		</div>
	);
}

export default App;
