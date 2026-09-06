import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// heatmapData looks like { "2026-09-04": 3, "2026-09-05": 1, ... }
const ActivityHeatmap = ({ heatmapData }) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setDate(today.getDate() - 365);

  const values = Object.entries(heatmapData).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <div className="overflow-x-auto">
      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={values}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count >= 4) return "color-scale-4";
          if (value.count === 3) return "color-scale-3";
          if (value.count === 2) return "color-scale-2";
          return "color-scale-1";
        }}
        tooltipDataAttrs={(value) => {
          if (!value || !value.date) return { "data-tip": "No activity" };
          return { "data-tip": `${value.date}: ${value.count || 0} entries` };
        }}
      />
    </div>
  );
};

export default ActivityHeatmap;