import { useBattleStore } from "../stores/battleStore";

const palettes = [
  { body: "#4c83a8", dark: "#31556f", light: "#d8edf2" },
  { body: "#8b5a91", dark: "#5b3866", light: "#f0d7e9" },
  { body: "#d27c45", dark: "#9b4e2e", light: "#ffe0b9" },
  { body: "#649069", dark: "#3d6548", light: "#d9ecd5" },
];

const Gladiator = ({ name, score, health, index, visible }: { name: string; score: number; health: number; index: number; visible: boolean }) => {
  const palette = palettes[index];
  const { statuses } = useBattleStore();
  const status = statuses[name.toLowerCase().replace("agent ", "")] ?? "ready";
  return <div className={`gladiator gladiator-${index} ${visible ? "" : "gladiator-hidden"}`}>
    <svg viewBox="0 0 120 170" role="img" aria-label={`${name} gladiator`} className="gladiator-art">
      <ellipse cx="60" cy="158" rx="39" ry="7" fill="#9d713f" opacity=".28" />
      <path d="M37 67h46l9 54H28Z" fill={palette.body} stroke={palette.dark} strokeWidth="3" />
      <path d="M31 80h58M34 99h52" stroke={palette.light} strokeWidth="3" opacity=".75" />
      <path d="M43 69c-2-22 4-36 17-36s19 14 17 36" fill="#f3c59a" stroke="#573a32" strokeWidth="3" />
      <path d="M37 42c2-20 41-24 47 1l-5 9H41Z" fill={palette.dark} stroke="#573a32" strokeWidth="3" />
      <path d="M35 46h50M42 35l-5-8M51 33l-1-10M61 32v-11M71 34l4-11M80 38l7-9" stroke="#e6b24e" strokeWidth="4" strokeLinecap="round" />
      <circle cx="51" cy="51" r="2" fill="#332329" /><circle cx="69" cy="51" r="2" fill="#332329" />
      <path d="M54 61q6 5 12 0" fill="none" stroke="#8c4c43" strokeWidth="2" />
      <path className="gladiator-arm gladiator-arm-left" d="M29 79 9 98l15 11 19-16" fill={palette.body} stroke={palette.dark} strokeWidth="3" />
      <path className="gladiator-arm gladiator-arm-right" d="M91 79l20 19-15 11-19-16" fill={palette.body} stroke={palette.dark} strokeWidth="3" />
      <path className="gladiator-leg gladiator-leg-left" d="M37 119 27 153h25l8-34" fill={palette.dark} stroke="#573a32" strokeWidth="3" />
      <path className="gladiator-leg gladiator-leg-right" d="M83 119l10 34H68l-8-34" fill={palette.dark} stroke="#573a32" strokeWidth="3" />
      <path className="gladiator-shield" d="M10 98 5 71" stroke="#c69038" strokeWidth="4" /><path className="gladiator-weapon" d="m3 72 7-10" stroke="#d7a940" strokeWidth="3" />
      <path className="gladiator-sword" d="M96 99h18" stroke="#d7a940" strokeWidth="4" /><path className="gladiator-sword" d="M112 98v-28" stroke="#d7a940" strokeWidth="3" />
    </svg>
    <div className="health-bar"><i style={{ width: `${health}%` }} /></div>
    <div className="gladiator-caption"><strong>{health <= 0 ? "ELIMINATED" : name.replace("Agent ", "")}</strong><span>{score || 0}</span></div>
    <div className="fighter-progress"><i style={{ width: `${score || 8}%`, background: palette.body }} /></div>
  </div>;
};

const Arena = () => {
  const { agents, scores, health, statuses, currentEvent, winnerId } = useBattleStore();
  const bubbleText = currentEvent && "text" in currentEvent ? currentEvent.text : currentEvent?.type === "round_started" ? currentEvent.label : currentEvent?.type === "impact_occurred" ? "CLANG! A shield catches the blow." : null;
  const bubbleAgent = currentEvent && "agentId" in currentEvent ? agents.find((agent) => agent.id === currentEvent.agentId)?.name : null;
  return <section className="arena-card">
    <div className="arena-toolbar"><div><span className="eyebrow">The grand colosseum</span><h2>Make your case. Claim the crown.</h2></div><span className="demo-badge">Demo arena</span></div>
    <div className="illustrated-arena">
      <svg className="arena-sky" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#bdeaf7" /><stop offset="1" stopColor="#e9f8f6" /></linearGradient><linearGradient id="stone" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#d99a68" /><stop offset="1" stopColor="#b8684b" /></linearGradient></defs>
        <rect width="1000" height="600" fill="url(#sky)" />
        <g fill="#fff" opacity=".8"><path d="M78 132c-17-24 16-43 34-28 14-37 70-24 65 13 38-5 45 38 16 48H85c-26 0-30-22-7-33Z" /><path d="M752 87c-12-20 15-37 29-24 15-28 54-17 53 12 30-4 40 31 14 40h-94c-21 0-23-20-2-28Z" /></g>
        <path d="M0 278Q500 215 1000 278V461H0Z" fill="url(#stone)" /><path d="M0 300Q500 238 1000 300" fill="none" stroke="#9e553f" strokeWidth="11" opacity=".7" />
        <path d="M0 344Q500 280 1000 344" fill="none" stroke="#e0a071" strokeWidth="12" opacity=".8" /><path d="M0 385Q500 318 1000 385" fill="none" stroke="#9e553f" strokeWidth="11" opacity=".7" />
        <g fill="#70483d" opacity=".9">{[0,1,2,3,4,5,6,7,8].map((x) => <path key={x} d={`M${55 + x * 110} 290v-22q0-30 30-30t30 30v22Z`} />)}{[0,1,2,3,4,5,6,7].map((x) => <path key={x} d={`M${111 + x * 110} 345v-19q0-27 27-27t27 27v19Z`} />)}</g>
        <g fill="#f4d58d" opacity=".72"><path d="M0 459Q500 375 1000 459v141H0Z" /><ellipse cx="500" cy="530" rx="378" ry="85" fill="#e9bf70" /></g>
        <g fill="#8e2638"><path d="M105 218h47v72h-47z" /><path d="m105 218 23-19 24 19Z" /><path d="M848 218h47v72h-47z" /><path d="m848 218 23-19 24 19Z" /></g>
        <g stroke="#e6b24e" strokeWidth="5" strokeLinecap="round"><path d="M79 448v-54M921 448v-54" /></g><g fill="#f7be55"><path d="m79 387 10 13H69Z" /><path d="m921 387 10 13h-20Z" /></g>
        <path d="M180 482Q500 410 820 482" fill="none" stroke="#b37c48" strokeWidth="10" opacity=".5" /><path d="M238 517Q500 469 762 517" fill="none" stroke="#b37c48" strokeWidth="6" opacity=".45" />
      </svg>
      <div className="arena-title-overlay">COLISEUM OF IDEAS</div>
      {bubbleText && <div className="battle-bubble"><strong>{bubbleAgent}</strong><span>{bubbleText}</span></div>}
      {currentEvent?.type === "impact_occurred" && <div className="impact-effect">✦</div>}
      {winnerId && <div className="winner-crown">♛</div>}
      <div className="gladiator-stage">{agents.map((agent, index) => <div className={`gladiator-slot status-${statuses[agent.id] || "ready"}`} key={agent.id}><Gladiator name={agent.name} score={scores[agent.id]} health={health[agent.id] ?? 100} index={index} visible={index < agents.length} /></div>)}</div>
    </div>
  </section>;
};

export default Arena;
