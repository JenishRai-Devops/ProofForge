import { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export const Icon = ({ children, ...props }: IconProps & { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
);

export const SwordIcon = (props: IconProps) => <Icon {...props}><path d="M14.5 4.5 19.5 2l-2.5 5-9.7 9.7" /><path d="m5.5 18.5-2 2M8 16l-2.5-2.5M4 13l7-7" /></Icon>;
export const PlusIcon = (props: IconProps) => <Icon {...props}><path d="M12 5v14M5 12h14" /></Icon>;
export const HistoryIcon = (props: IconProps) => <Icon {...props}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></Icon>;
export const BookmarkIcon = (props: IconProps) => <Icon {...props}><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.5L6 21Z" /></Icon>;
export const TrophyIcon = (props: IconProps) => <Icon {...props}><path d="M8 4h8v4a4 4 0 0 1-8 0Z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 12v5M8 20h8M9 17h6" /></Icon>;
export const SettingsIcon = (props: IconProps) => <Icon {...props}><path d="m12 3 1 2.1 2.3.6 1.9-1 1.8 1.8-1 1.9.6 2.3 2.1 1v2l-2.1 1-.6 2.3 1 1.9-1.8 1.8-1.9-1-2.3.6-1 2.1h-2l-1-2.1-2.3-.6-1.9 1-1.8-1.8 1-1.9-.6-2.3-2.1-1v-2l2.1-1 .6-2.3-1-1.9L5.7 4.7l1.9 1 2.3-.6 1-2.1Z" /><circle cx="12" cy="12" r="3" /></Icon>;
export const ChevronIcon = (props: IconProps) => <Icon {...props}><path d="m7 9 5 5 5-5" /></Icon>;
export const SparkIcon = (props: IconProps) => <Icon {...props}><path d="m12 3-1.3 5.7L5 10l5.7 1.3L12 17l1.3-5.7L19 10l-5.7-1.3Z" /><path d="m19 16-.5 2.5L16 19l2.5.5L19 22l.5-2.5L22 19l-2.5-.5Z" /></Icon>;
