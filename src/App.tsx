import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import RightPanel from "./components/RightPanel";
import FooterBar from "./components/FooterBar";
import Arena from "./arena/Arena";
import { useBattleStore } from "./stores/battleStore";

const App = () => {
  const battleState = useBattleStore((state) => state.battleState);
  return <div className={`app-shell ${battleState === "paused" ? "battle-paused" : ""}`}><Sidebar /><div className="app-content"><HeaderBar /><div className="workspace"><main className="main-column"><Arena /><FooterBar /></main><RightPanel /></div></div></div>;
};

export default App;
