import { BookmarkIcon, HistoryIcon, PlusIcon, SettingsIcon, SparkIcon, SwordIcon, TrophyIcon } from "./Icon";
import { useBattleStore } from "../stores/battleStore";

const items = [
  { label: "New Battle", icon: PlusIcon, active: true },
  { label: "History", icon: HistoryIcon },
  { label: "Saved Battles", icon: BookmarkIcon },
  { label: "Leaderboard", icon: TrophyIcon },
];

const Sidebar = () => {
  const { startBattle } = useBattleStore();
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><SwordIcon /></div>
        <div><div className="brand-name">ProofForge</div><div className="brand-subtitle">AI Agent Arena</div></div>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map(({ label, icon: ItemIcon, active }) => (
          <button key={label} type="button" className={`sidebar-link ${active ? "sidebar-link-active" : ""}`} onClick={active ? startBattle : undefined}>
            <ItemIcon /> <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="tip-card"><div className="tip-icon"><SparkIcon /></div><div><strong>Forge better answers</strong><p>Clear prompts lead to stronger debates.</p></div></div>
      <button type="button" className="sidebar-link settings-link"><SettingsIcon /><span>Settings</span></button>
      <div className="sidebar-user"><div className="user-avatar">PF</div><div><strong>Demo workspace</strong><span>Free plan</span></div><span className="user-dot" /></div>
    </aside>
  );
};

export default Sidebar;
