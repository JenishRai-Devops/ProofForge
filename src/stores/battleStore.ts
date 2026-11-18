import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Agent = { id: string; name: string; color: string };
export type BattleState = "idle" | "running" | "paused" | "finished";
export type BattleRound = "initial" | "cross-examination" | "evidence" | "verdict";
export type AgentStatus = "ready" | "walking" | "running" | "speaking" | "approaching" | "attacking" | "blocking" | "dodging" | "hit_reaction" | "staggering" | "knocked_down" | "getting_up" | "retreating" | "defeated" | "winner";

export type BattleEvent =
  | { id: string; type: "round_started"; round: BattleRound; label: string; timestamp: number }
  | { id: string; type: "agent_entered"; round: "initial"; agentId: string; timestamp: number }
  | { id: string; type: "agent_spoke"; round: "initial"; agentId: string; text: string; timestamp: number }
  | { id: string; type: "challenge"; round: "cross-examination"; agentId: string; targetId: string; text: string; timestamp: number }
  | { id: string; type: "agent_running"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "agent_attacking"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "attack_started"; round: "cross-examination"; agentId: string; targetId: string; damage: number; timestamp: number }
  | { id: string; type: "attack_connected"; round: "cross-examination"; agentId: string; targetId: string; damage: number; timestamp: number }
  | { id: string; type: "agent_blocking"; round: "cross-examination"; agentId: string; targetId: string; text: string; timestamp: number }
  | { id: string; type: "attack_blocked"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "impact_occurred"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "damage_applied"; round: "cross-examination"; agentId: string; targetId: string; damage: number; health: number; timestamp: number }
  | { id: string; type: "agent_staggered"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "agent_knocked_down"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "agent_recovered"; round: "cross-examination"; agentId: string; timestamp: number }
  | { id: string; type: "agent_retreating"; round: "cross-examination"; agentId: string; targetId: string; timestamp: number }
  | { id: string; type: "score_updated"; round: "evidence"; agentId: string; score: number; reason: string; timestamp: number }
  | { id: string; type: "round_completed"; round: BattleRound; timestamp: number }
  | { id: string; type: "agent_eliminated"; round: "verdict"; agentId: string; timestamp: number }
  | { id: string; type: "final_duel_started"; round: "verdict"; agentIds: [string, string]; timestamp: number }
  | { id: string; type: "winner_declared"; round: "verdict"; winnerId: string; timestamp: number }
  | { id: string; type: "verdict"; round: "verdict"; winnerId: string; text: string; timestamp: number }
  | { id: string; type: "battle_completed"; round: "verdict"; timestamp: number };

export type Evaluation = {
  agentId: string;
  answer: string;
  explanation: string;
  criteria: { label: string; score: number }[];
  total: number;
};

const baseAgents: Agent[] = [
  { id: "alpha", name: "Agent Alpha", color: "#5d78a6" },
  { id: "beta", name: "Agent Beta", color: "#8c5a91" },
  { id: "gamma", name: "Agent Gamma", color: "#d27c45" },
  { id: "delta", name: "Agent Delta", color: "#649069" },
];

export const evaluations: Evaluation[] = [
  { agentId: "alpha", answer: "A transparent, reversible policy with measurable checkpoints earns durable trust.", explanation: "Alpha connected a clear principle to practical evidence and acknowledged trade-offs.", criteria: [{ label: "Reasoning", score: 92 }, { label: "Evidence", score: 88 }, { label: "Clarity", score: 94 }], total: 91 },
  { agentId: "beta", answer: "The fastest path is to act decisively first and refine the details later.", explanation: "Beta made a persuasive opening, but its proposal left important risks untested.", criteria: [{ label: "Reasoning", score: 83 }, { label: "Evidence", score: 74 }, { label: "Clarity", score: 89 }], total: 82 },
  { agentId: "gamma", answer: "Many viewpoints should be gathered before any conclusion is treated as final.", explanation: "Gamma showed empathy and breadth, though the answer was less specific on execution.", criteria: [{ label: "Reasoning", score: 86 }, { label: "Evidence", score: 81 }, { label: "Clarity", score: 78 }], total: 82 },
  { agentId: "delta", answer: "A strong result comes from intuition, speed, and the confidence to commit.", explanation: "Delta was concise and bold, but supplied fewer verifiable supporting details.", criteria: [{ label: "Reasoning", score: 79 }, { label: "Evidence", score: 69 }, { label: "Clarity", score: 87 }], total: 78 },
];

type TranscriptLine = { agentId: string; text: string; kind: "speech" | "challenge" | "defense" };
type BattleStore = {
  agentCount: number;
  agents: Agent[];
  battleState: BattleState;
  round: BattleRound | null;
  events: BattleEvent[];
  currentEvent: BattleEvent | null;
  transcript: TranscriptLine[];
  scores: Record<string, number>;
  health: Record<string, number>;
  statuses: Record<string, AgentStatus>;
  winnerId: string | null;
  evaluations: Evaluation[];
  animationSpeed: number;
  setAgentCount: (count: number) => void;
  startBattle: () => void;
  pauseBattle: () => void;
  resumeBattle: () => void;
  restartBattle: () => void;
  setAnimationSpeed: (speed: number) => void;
};

let runId = 0;
const initialScores = (count: number) => Object.fromEntries(baseAgents.slice(0, count).map((agent) => [agent.id, 0]));
const initialStatuses = (count: number) => Object.fromEntries(baseAgents.slice(0, count).map((agent) => [agent.id, "ready" as AgentStatus]));
const resetState = (count: number) => ({ battleState: "idle" as BattleState, round: null, events: [] as BattleEvent[], currentEvent: null, transcript: [] as TranscriptLine[], scores: initialScores(count), statuses: initialStatuses(count), winnerId: null });
const initialHealth = (count: number) => Object.fromEntries(baseAgents.slice(0, count).map((agent) => [agent.id, 100]));
type EventPayload = { [T in BattleEvent["type"]]: Omit<Extract<BattleEvent, { type: T }>, "id" | "timestamp"> }[BattleEvent["type"]];
const makeEvent = (payload: EventPayload): BattleEvent => ({ ...payload, id: `${payload.type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: Date.now() } as BattleEvent);

const pairingsFor = (agents: Agent[]) => agents.length === 2
  ? [[agents[0], agents[1]], [agents[1], agents[0]]]
  : agents.length === 3
    ? [[agents[0], agents[1]], [agents[1], agents[2]], [agents[2], agents[0]]]
    : [[agents[0], agents[1]], [agents[1], agents[2]], [agents[2], agents[3]], [agents[3], agents[0]], [agents[2], agents[0]]];

export const useBattleStore = create<BattleStore>()(devtools((set, get) => {
  const wait = async (duration: number, currentRun: number) => {
    let remaining = duration;
    while (remaining > 0 && currentRun === runId) {
      if (get().battleState !== "paused") {
        const tick = Math.min(50, remaining) * get().animationSpeed;
        await new Promise((resolve) => setTimeout(resolve, tick));
        remaining -= Math.min(50, remaining);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  };
  const publish = async (nextEvent: BattleEvent, currentRun: number) => {
    if (currentRun !== runId) return false;
    const current = get();
    const statuses = { ...current.statuses };
    Object.keys(statuses).forEach((id) => { if (statuses[id] !== "defeated" && statuses[id] !== "winner") statuses[id] = "ready"; });
    const transcript = [...current.transcript];
    if (nextEvent.type === "agent_entered") statuses[nextEvent.agentId] = "walking";
    if (nextEvent.type === "agent_spoke") {
      statuses[nextEvent.agentId] = "speaking";
      transcript.push({ agentId: nextEvent.agentId, text: nextEvent.text, kind: "speech" });
    }
    if (nextEvent.type === "challenge") {
      statuses[nextEvent.agentId] = "attacking";
      transcript.push({ agentId: nextEvent.agentId, text: nextEvent.text, kind: "challenge" });
    }
    if (nextEvent.type === "attack_started") statuses[nextEvent.agentId] = "attacking";
    if (nextEvent.type === "agent_running") statuses[nextEvent.agentId] = "running";
    if (nextEvent.type === "agent_attacking") statuses[nextEvent.agentId] = "attacking";
    if (nextEvent.type === "agent_blocking") {
      statuses[nextEvent.agentId] = "blocking";
      transcript.push({ agentId: nextEvent.agentId, text: nextEvent.text, kind: "defense" });
    }
    if (nextEvent.type === "attack_blocked") statuses[nextEvent.targetId] = "blocking";
    if (nextEvent.type === "impact_occurred") statuses[nextEvent.targetId] = "hit_reaction";
    if (nextEvent.type === "damage_applied") statuses[nextEvent.targetId] = "staggering";
    if (nextEvent.type === "agent_staggered") statuses[nextEvent.agentId] = "staggering";
    if (nextEvent.type === "agent_knocked_down") statuses[nextEvent.agentId] = "knocked_down";
    if (nextEvent.type === "agent_recovered") statuses[nextEvent.agentId] = "getting_up";
    if (nextEvent.type === "agent_retreating") statuses[nextEvent.agentId] = "retreating";
    if (nextEvent.type === "agent_eliminated") statuses[nextEvent.agentId] = "defeated";
    if (nextEvent.type === "verdict" || nextEvent.type === "winner_declared") statuses[nextEvent.winnerId] = "winner";
    set({
      events: [...current.events, nextEvent],
      currentEvent: nextEvent,
      round: nextEvent.round,
      transcript,
      statuses,
      scores: nextEvent.type === "score_updated" ? { ...current.scores, [nextEvent.agentId]: nextEvent.score } : current.scores,
      health: nextEvent.type === "damage_applied" ? { ...current.health, [nextEvent.targetId]: Math.max(0, nextEvent.health) } : current.health,
      winnerId: nextEvent.type === "verdict" || nextEvent.type === "winner_declared" ? nextEvent.winnerId : current.winnerId,
      battleState: nextEvent.type === "battle_completed" ? "finished" : current.battleState,
    });
    return true;
  };
  const runBattle = async (currentRun: number) => {
    const selected = baseAgents.slice(0, get().agentCount);
    const winner = selected.reduce((best, agent) => (evaluations.find((item) => item.agentId === agent.id)!.total > evaluations.find((item) => item.agentId === best.id)!.total ? agent : best), selected[0]);
    const emit = async (payload: EventPayload, duration: number) => { const accepted = await publish(makeEvent(payload), currentRun); if (accepted) await wait(duration, currentRun); return accepted; };
    const combatExchange = async (attacker: Agent, defender: Agent, lethal = false) => {
      const attackerScore = evaluations.find((item) => item.agentId === attacker.id)!.total;
      const defenderScore = evaluations.find((item) => item.agentId === defender.id)!.total;
      const damage = lethal ? get().health[defender.id] : Math.max(8, Math.round((attackerScore - defenderScore) / 3) + 10);
      if (!(await emit({ type: "challenge", round: "cross-examination", agentId: attacker.id, targetId: defender.id, text: `${attacker.name} challenges ${defender.name}: prove your claim.` }, 350))) return false;
      if (!(await emit({ type: "agent_running", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 500))) return false;
      if (!(await emit({ type: "attack_started", round: "cross-examination", agentId: attacker.id, targetId: defender.id, damage }, 350))) return false;
      if (!(await emit({ type: "agent_attacking", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 400))) return false;
      if (!(await emit({ type: "agent_blocking", round: "cross-examination", agentId: defender.id, targetId: attacker.id, text: `${defender.name} raises a shield: the evidence holds.` }, 350))) return false;
      if (!lethal && attackerScore <= defenderScore) {
        if (!(await emit({ type: "attack_blocked", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 350))) return false;
        if (!(await emit({ type: "impact_occurred", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 300))) return false;
      } else {
        const health = Math.max(0, get().health[defender.id] - damage);
        if (!(await emit({ type: "attack_connected", round: "cross-examination", agentId: attacker.id, targetId: defender.id, damage }, 280))) return false;
        if (!(await emit({ type: "impact_occurred", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 300))) return false;
        if (!(await emit({ type: "damage_applied", round: "cross-examination", agentId: attacker.id, targetId: defender.id, damage, health }, 500))) return false;
        if (!(await emit({ type: "agent_staggered", round: "cross-examination", agentId: defender.id, targetId: attacker.id }, 400))) return false;
        if (health <= 0) {
          if (!(await emit({ type: "agent_knocked_down", round: "cross-examination", agentId: defender.id, targetId: attacker.id }, 700))) return false;
        }
      }
      if (!(await emit({ type: "agent_retreating", round: "cross-examination", agentId: attacker.id, targetId: defender.id }, 450))) return false;
      return true;
    };
    if (!(await emit({ type: "round_started", round: "initial", label: "Initial Answers" }, 350))) return;
    for (const agent of selected) {
      if (!(await emit({ type: "agent_entered", round: "initial", agentId: agent.id }, 500))) return;
    }
    for (const agent of selected) {
      if (!(await emit({ type: "agent_spoke", round: "initial", agentId: agent.id, text: evaluations.find((item) => item.agentId === agent.id)!.answer }, 1000))) return;
    }
    if (!(await emit({ type: "round_completed", round: "initial" }, 250))) return;
    if (!(await emit({ type: "round_started", round: "cross-examination", label: "Cross Examination" }, 350))) return;
    for (const [attacker, defender] of pairingsFor(selected)) {
      if (!(await combatExchange(attacker, defender))) return;
    }
    const eliminationOrder = selected.filter((agent) => agent.id !== winner.id).sort((a, b) => evaluations.find((item) => item.agentId === a.id)!.total - evaluations.find((item) => item.agentId === b.id)!.total);
    for (const eliminated of eliminationOrder.slice(0, Math.max(0, selected.length - 2))) {
      const attacker = selected.find((agent) => agent.id === winner.id)!;
      if (!(await combatExchange(attacker, eliminated, true))) return;
      if (!(await emit({ type: "agent_eliminated", round: "verdict", agentId: eliminated.id }, 650))) return;
    }
    if (!(await emit({ type: "round_completed", round: "cross-examination" }, 250))) return;
    if (!(await emit({ type: "round_started", round: "evidence", label: "Evidence and Scoring" }, 350))) return;
    for (const agent of selected) {
      const evaluation = evaluations.find((item) => item.agentId === agent.id)!;
      if (!(await emit({ type: "score_updated", round: "evidence", agentId: agent.id, score: evaluation.total, reason: evaluation.explanation }, 650))) return;
    }
    if (!(await emit({ type: "round_completed", round: "evidence" }, 250))) return;
    if (!(await emit({ type: "round_started", round: "verdict", label: "Final Verdict" }, 450))) return;
    const finalists = selected.filter((agent) => agent.id === winner.id || !eliminationOrder.slice(0, Math.max(0, selected.length - 2)).some((eliminated) => eliminated.id === agent.id));
    if (finalists.length === 2) {
      if (!(await emit({ type: "final_duel_started", round: "verdict", agentIds: [finalists[0].id, finalists[1].id] }, 700))) return;
      const opponent = finalists.find((agent) => agent.id !== winner.id)!;
      if (!(await combatExchange(winner, opponent, true))) return;
      if (!(await emit({ type: "agent_eliminated", round: "verdict", agentId: opponent.id }, 650))) return;
    }
    if (!(await emit({ type: "winner_declared", round: "verdict", winnerId: winner.id }, 450))) return;
    if (!(await emit({ type: "verdict", round: "verdict", winnerId: winner.id, text: `${winner.name} wins with the strongest blend of evidence, reasoning, and clarity.` }, 1100))) return;
    await emit({ type: "battle_completed", round: "verdict" }, 0);
  };

  return {
    agentCount: 4, agents: baseAgents, ...resetState(4), health: initialHealth(4), evaluations, animationSpeed: 1,
    setAgentCount: (count) => { runId += 1; set({ agentCount: count, agents: baseAgents.slice(0, count), ...resetState(count), health: initialHealth(count) }); },
    startBattle: () => { if (get().battleState === "running" || get().battleState === "paused") return; runId += 1; const currentRun = runId; set({ ...resetState(get().agentCount), health: initialHealth(get().agentCount), battleState: "running" }); void runBattle(currentRun); },
    pauseBattle: () => { if (get().battleState === "running") set({ battleState: "paused" }); },
    resumeBattle: () => { if (get().battleState === "paused") set({ battleState: "running" }); },
    restartBattle: () => { runId += 1; set({ ...resetState(get().agentCount), health: initialHealth(get().agentCount) }); },
    setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  };
}));
