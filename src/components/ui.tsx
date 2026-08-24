import type { RiskLevel } from "../data";
import { useLocale } from "../i18n";
import "./ui.css";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warn" | "danger" | "ok";
}) {
  return <span className={`badge tone-${tone}`}>{children}</span>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const { pick, t } = useLocale();
  const tone =
    risk === "critical" ? "danger" : risk === "high" ? "warn" : risk === "moderate" ? "accent" : "ok";
  return <Badge tone={tone}>{pick(t.common.risk[risk])}</Badge>;
}

export function ReviewFlag({ reviewed }: { reviewed: boolean }) {
  const { pick, t } = useLocale();
  return reviewed ? (
    <Badge tone="ok">{pick(t.common.approved)}</Badge>
  ) : (
    <Badge tone="warn">{pick(t.common.draft)}</Badge>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="page-header reveal">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className="page-header-row">
        <h1>{title}</h1>
        {actions}
      </div>
      {lead ? <p className="lead">{lead}</p> : null}
    </header>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const { pick, t } = useLocale();
  return (
    <label className="search-field">
      <span className="sr-only">{pick(t.common.search)}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}
