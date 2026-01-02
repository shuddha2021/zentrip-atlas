"use client";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface MonthSelectorProps {
  currentMonth: number;
}

export function MonthSelector({ currentMonth }: MonthSelectorProps) {
  return (
    <form method="GET" className="flex items-center gap-2">
      <label htmlFor="month" className="text-sm font-medium text-gray-700">
        Month:
      </label>
      <select
        id="month"
        name="month"
        defaultValue={currentMonth}
        onChange={(e) => {
          const form = e.target.form;
          if (form) form.submit();
        }}
        className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        {MONTHS.map((name, idx) => (
          <option key={idx + 1} value={idx + 1}>
            {name}
          </option>
        ))}
      </select>
    </form>
  );
}
