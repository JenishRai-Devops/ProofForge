import Phaser from "phaser";
import { Agent, BattleEvent } from "../../stores/battleStore";

type Fighter = { container: Phaser.GameObjects.Container; agent: Agent; homeX: number };

class MainScene extends Phaser.Scene {
  private fighters = new Map<string, Fighter>();
  private arenaAgents: Agent[] = [];
  private bubble?: Phaser.GameObjects.Container;

  constructor() {
    super("main-arena");
  }

  create() {
    this.drawArena();
    this.scale.on("resize", this.drawArena, this);
  }

  setAgents(agents: Agent[]) {
    this.arenaAgents = agents;
    this.drawArena();
  }

  handleBattleEvent(battleEvent: BattleEvent) {
    if (battleEvent.type === "round_started") {
      this.showBubble("ROUND: " + battleEvent.label, "#800020");
    }
    if (battleEvent.type === "agent_spoke") this.speak(battleEvent.agentId, battleEvent.text);
    if (battleEvent.type === "challenge") this.attack(battleEvent.agentId, battleEvent.targetId, battleEvent.text);
    if (battleEvent.type === "agent_blocking") this.defend(battleEvent.agentId, battleEvent.text);
    if (battleEvent.type === "score_updated") this.score(battleEvent.agentId, battleEvent.score);
    if (battleEvent.type === "verdict") this.verdict(battleEvent.winnerId, battleEvent.text);
  }

  private drawArena() {
    const { width, height } = this.scale;
    this.children.removeAll();
    this.fighters.clear();
    const graphics = this.add.graphics();
    graphics.fillStyle(0xe6c96b, 1).fillRect(0, 0, width, height);
    graphics.fillStyle(0xc45a46, 1).fillRect(0, 0, width, Math.min(42, height * 0.14));
    graphics.fillStyle(0xfdf5e6, 0.92).fillEllipse(width / 2, height * 0.63, Math.min(width * 0.72, 560), Math.min(height * 0.5, 270));
    graphics.lineStyle(5, 0xc45a46, 0.8).strokeEllipse(width / 2, height * 0.63, Math.min(width * 0.72, 560), Math.min(height * 0.5, 270));
    this.add.text(width / 2, height * 0.16, "THE PROOF FORGE", { color: "#800020", fontFamily: "Georgia", fontSize: `${Math.max(16, Math.min(28, width / 22))}px`, fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(width / 2, height * 0.87, "SIMULATED MATCH • MOCK EVALUATION DATA", { color: "#806b5e", fontFamily: "Arial", fontSize: "11px", fontStyle: "bold" }).setOrigin(0.5);
    this.arenaAgents.forEach((agent, index) => this.createFighter(agent, index, width, height));
  }

  private createFighter(agent: Agent, index: number, width: number, height: number) {
    const spacing = width / (this.arenaAgents.length + 1);
    const homeX = spacing * (index + 1);
    const y = height * 0.58;
    const container = this.add.container(homeX, y);
    const body = this.add.graphics();
    body.fillStyle(Phaser.Display.Color.HexStringToColor(agent.color).color, 1).fillCircle(0, 10, 28);
    body.fillStyle(0xf6d6ad, 1).fillCircle(0, -23, 16);
    body.fillStyle(0x33251f, 1).fillRect(-18, -39, 36, 7);
    body.fillStyle(0x800020, 1).fillTriangle(-20, -38, 20, -38, 0, -54);
    container.add(body);
    container.add(this.add.text(0, 48, agent.name.replace("Agent ", ""), { color: "#33251f", fontFamily: "Arial", fontSize: "13px", fontStyle: "bold" }).setOrigin(0.5));
    this.fighters.set(agent.id, { container, agent, homeX });
  }

  private showBubble(text: string, color = "#33251f") {
    this.bubble?.destroy();
    const bubble = this.add.container(this.scale.width / 2, 70);
    const background = this.add.graphics().fillStyle(0xfdf5e6, 0.98).fillRoundedRect(-170, -22, 340, 44, 12);
    background.lineStyle(2, 0xc45a46, 0.7).strokeRoundedRect(-170, -22, 340, 44, 12);
    bubble.add(background);
    bubble.add(this.add.text(0, 0, text, { color, fontFamily: "Arial", fontSize: "13px", fontStyle: "bold", align: "center", wordWrap: { width: 310 } }).setOrigin(0.5));
    this.bubble = bubble;
  }

  private speak(agentId: string, text: string) {
    const fighter = this.fighters.get(agentId);
    if (!fighter) return;
    this.showBubble(text);
    this.tweens.add({ targets: fighter.container, y: fighter.container.y - 12, duration: 220, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
  }

  private attack(agentId: string, targetId: string, text: string) {
    const attacker = this.fighters.get(agentId);
    const target = this.fighters.get(targetId);
    if (!attacker || !target) return;
    this.showBubble(text, "#800020");
    this.tweens.add({ targets: attacker.container, x: target.container.x - 55, duration: 320, yoyo: true, ease: "Quad.easeInOut" });
    this.tweens.add({ targets: target.container, angle: -12, duration: 100, yoyo: true, repeat: 2 });
  }

  private defend(agentId: string, text: string) {
    const fighter = this.fighters.get(agentId);
    if (!fighter) return;
    this.showBubble("🛡 " + text, "#5d78a6");
    const shield = this.add.graphics().lineStyle(5, 0x5d78a6, 1).strokeCircle(fighter.container.x, fighter.container.y - 5, 38);
    this.tweens.add({ targets: shield, alpha: 0, scale: 1.4, duration: 500, onComplete: () => shield.destroy() });
  }

  private score(agentId: string, value: number) {
    const fighter = this.fighters.get(agentId);
    if (!fighter) return;
    this.showBubble(`${fighter.agent.name}: ${value}/100`, "#668c62");
    this.tweens.add({ targets: fighter.container, scale: 1.18, duration: 180, yoyo: true, repeat: 1, ease: "Sine.easeInOut" });
  }

  private verdict(winnerId: string, text: string) {
    const winner = this.fighters.get(winnerId);
    if (!winner) return;
    this.showBubble(text, "#800020");
    this.fighters.forEach((fighter, id) => {
      if (id !== winnerId) this.tweens.add({ targets: fighter.container, x: fighter.homeX < this.scale.width / 2 ? -100 : this.scale.width + 100, alpha: 0.2, duration: 850, ease: "Back.easeIn" });
    });
    this.tweens.add({ targets: winner.container, x: this.scale.width / 2, y: this.scale.height * 0.56, scale: 1.25, duration: 900, ease: "Back.easeOut" });
    this.add.text(this.scale.width / 2, this.scale.height * 0.3, "♛", { color: "#d99b2b", fontFamily: "Georgia", fontSize: "64px", fontStyle: "bold" }).setOrigin(0.5);
  }
}

export default MainScene;
