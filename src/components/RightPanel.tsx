import { useBattleStore } from "../stores/battleStore";

const colors = ["#4c83a8", "#8b5a91", "#d27c45", "#649069"];

const RightPanel = () => {
  const { events, battleState, agents, scores, statuses, transcript, round } = useBattleStore();
  const latest = transcript[transcript.length - 1];
  return (
    <aside className="live-panel">
      <div className="panel-heading"><div><div className="eyebrow">Arena feed</div><h2>Live Battle</h2></div><span className={`status-pill ${battleState}`}>{battleState === "idle" ? "Ready" : battleState === "finished" ? "Complete" : "In progress"}</span></div>
      <div className="round-card"><span className="round-pulse" /><div><span>Current round</span><strong>{round ? round === "cross-examination" ? "Cross Examination" : round === "evidence" ? "Evidence & Testing" : round === "verdict" ? "Final Verdict" : "Initial Answers" : "Initial Answers"}</strong></div></div>
      {latest && <div className="message-card"><div className="message-meta"><span className="agent-dot" style={{ backgroundColor: colors[agents.findIndex((agent) => agent.id === latest.agentId)] }} /> <strong>{agents.find((agent) => agent.id === latest.agentId)?.name}</strong><time>now</time></div><p>{latest.text}</p></div>}
      <div className="panel-section"><div className="section-label">Fighters <span>{agents.length}/4 selected</span></div><div className="agent-list">{agents.map((agent, index) => <div className="live-agent" key={agent.id}><div className="mini-avatar" style={{ backgroundColor: colors[index] }}>{agent.name.replace("Agent ", "").charAt(0)}</div><div className="live-agent-info"><div><strong>{agent.name.replace("Agent ", "")}</strong><span>{scores[agent.id] || "—"}</span></div><div className="mini-progress"><i style={{ width: `${scores[agent.id] || 12}%`, backgroundColor: colors[index] }} /></div><small>{statuses[agent.id] || "ready"}</small></div></div>)}</div></div>
      <div className="panel-section activity-section"><div className="section-label">Recent activity <span>{events.length} events</span></div><div className="activity-list">{events.slice(-4).map((event) => <div className="activity-row" key={event.id}><span className="activity-dot" /> <span>{event.type === "round_started" ? event.label : event.type === "score_updated" ? "Evaluation score updated" : event.type === "verdict" ? "Verdict delivered" : event.type === "challenge" ? "Challenge issued" : event.type === "agent_blocking" ? "Defense presented" : event.type === "impact_occurred" ? "Weapon impact" : event.type === "agent_running" ? "Agent running" : event.type === "agent_attacking" ? "Weapon attack" : "Agent answered"}</span><time>now</time></div>)}</div></div>
    </aside>
  );
};

export default RightPanel;
