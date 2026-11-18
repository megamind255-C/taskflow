// client/src/components/StatCard.jsx
// A single dashboard statistic tile.

export default function StatCard({ label, value, variant }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
    </div>
  );
}