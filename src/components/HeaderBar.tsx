import { useState } from "react";
import { ChevronIcon, SparkIcon, SwordIcon } from "./Icon";
import { useBattleStore } from "../stores/battleStore";

const HeaderBar = () => {
  const { agentCount, setAgentCount, startBattle, pauseBattle, resumeBattle, battleState, animationSpeed, setAnimationSpeed } = useBattleStore();
  const [prompt, setPrompt] = useState("Should AI assistants be required to explain their reasoning?");
  return (
    <header className="top-header">
      <div className="page-heading"><div className="mobile-mark"><SwordIcon /></div><div><div className="eyebrow">ProofForge arena</div><h1>AI Agent Battle Arena</h1></div></div>
      <div className="battle-controls">
        <label className="prompt-field"><span>Battle prompt</span><input value={prompt} onChange={(event) => setPrompt(event.target.value)} aria-label="Battle prompt" /></label>
        <label className="agent-select"><span>Agents</span><span className="select-wrap"><select value={agentCount} onChange={(event) => setAgentCount(Number(event.target.value))} aria-label="Number of agents"><option value={2}>2 agents</option><option value={3}>3 agents</option><option value={4}>4 agents</option></select><ChevronIcon /></span></label>
        <div className="battle-actions">
          {(battleState === "running" || battleState === "paused") && <button type="button" className="secondary-button" onClick={battleState === "paused" ? resumeBattle : pauseBattle}>{battleState === "paused" ? "Resume" : "Pause"}</button>}
          <label className="speed-control"><span>Speed</span><select value={animationSpeed} onChange={(event) => setAnimationSpeed(Number(event.target.value))} aria-label="Animation speed"><option value={0.65}>0.65x</option><option value={1}>1x</option><option value={1.5}>1.5x</option></select></label>
          <button type="button" className="primary-button" onClick={startBattle} disabled={battleState === "running" || battleState === "paused"}><SparkIcon /> {battleState === "finished" ? "Battle Again" : "Start Battle"}</button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
