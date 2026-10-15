import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

const RANGES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

const tick = { fontSize: 12, fill: "rgb(var(--muted))" };

// overview looks like { daily: [{label, count}], weekly: [...], monthly: [...], yearly: [...] }
const OverviewCharts = ({ overview }) => {
  const [range, setRange] = useState("daily");
  const data = overview?.[range] || [];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`text-sm rounded-full px-4 py-1.5 font-medium transition ${
              range === r.key
                ? "bg-accent text-accent-fg"
                : "bg-surface2 text-muted hover:text-fg"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={tick} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              cursor={{ fill: "rgb(var(--surface-2))" }}
              contentStyle={{
                background: "rgb(var(--surface))",
                border: "1px solid rgb(var(--line))",
                borderRadius: 12,
                color: "rgb(var(--fg))",
              }}
            />
            <Bar dataKey="count" fill="rgb(var(--accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewCharts;