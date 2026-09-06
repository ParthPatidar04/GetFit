import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";

const RANGES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

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
            className={`text-sm rounded-lg px-3 py-1.5 border ${
              range === r.key
                ? "bg-primary-600 text-white border-primary-600"
                : "border-gray-300 dark:border-gray-700"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewCharts;