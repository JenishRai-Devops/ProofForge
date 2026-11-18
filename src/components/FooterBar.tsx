import { evaluations, useBattleStore } from "../stores/battleStore";
import { TrophyIcon } from "./Icon";

const rounds = ["Initial Answers", "Cross Examination", "Evidence & Testing", "Final Verdict"];

const FooterBar = () => {
  const { battleState, restartBattle, startBattle, winnerId, agents, scores, round } = useBattleStore();
  const active = round === "initial" ? 0 : round === "cross-examination" ? 1 : round === "evidence" ? 2 : round === "verdict" ? 3 : 0;
  const winner = winnerId ? evaluations.find((item) => item.agentId === winnerId) : null;
  return <section className="bottom-area">
    <div className="progress-card"><div className="progress-header"><div><div className="eyebrow">Battle progress</div><h2>Four rounds to a final verdict</h2></div><button type="button" className="ghost-button" onClick={() => { restartBattle(); startBattle(); }}>Replay demo</button></div><div className="round-track">{rounds.map((label, index) => <div className={`round-step ${index <= active && battleState !== "idle" ? "complete" : ""} ${index === active && battleState !== "finished" ? "current" : ""}`} key={label}><div className="step-marker">{index < active || battleState === "finished" ? "✓" : index + 1}</div><span>{label}</span>{index < 3 && <i />}</div>)}</div></div>
    {winner && <div className="result-card"><div className="result-trophy"><TrophyIcon /></div><div className="result-content"><span className="result-label">Simulated result · champion crowned</span><h2>{agents.find((agent) => agent.id === winner.agentId)?.name} wins the arena</h2><p className="winning-answer">“{winner.answer}”</p><p className="winner-reason">{winner.explanation}</p><div className="result-scores">{winner.criteria.map((criterion) => <div key={criterion.label}><span>{criterion.label}</span><strong>{criterion.score}</strong></div>)}</div></div><button type="button" className="outline-button">View Full Comparison <span>→</span></button></div>}
  </section>;
};

export default FooterBar;
