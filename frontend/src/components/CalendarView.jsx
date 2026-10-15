import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// heatmapData looks like { "2026-09-04": 3, ... }
const CalendarView = ({ heatmapData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatKey = (date) => date.toISOString().split("T")[0];
  const selectedCount = heatmapData[formatKey(selectedDate)] || 0;

  return (
    <div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={({ date }) => {
          const key = formatKey(date);
          return heatmapData[key] ? "has-activity" : null;
        }}
        className="!border-0 !bg-transparent !w-full"
      />
      <p className="text-sm text-muted mt-3">
        {selectedDate.toDateString()}: <span className="font-medium">{selectedCount}</span>{" "}
        {selectedCount === 1 ? "entry" : "entries"}
      </p>
    </div>
  );
};

export default CalendarView;