import Head from "next/head";
import { useState } from "react";

export default function Planner() {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const people = ["Sandra", "Emeka", "Precious"];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Set up editable shift data
  const [shiftData, setShiftData] = useState(() => {
    const init: { [person: string]: { [day: string]: string } } = {};
    people.forEach((name) => {
      init[name] = {};
      days.forEach((day) => {
        init[name][day] = "";
      });
    });
    return init;
  });

  // Calculate week dates from Monday
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    monday.setDate(today.getDate() + diffToMonday + currentWeekOffset * 7);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const week = getWeekDates();

  return (
    <>
      <Head>
        <title>Shift Planner - Weekly View</title>
      </Head>
      <main className="p-6">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
          Weekly Shift Planner
        </h1>

        {/* Arrows and Week Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            className="text-xl px-3 py-1 bg-gray-200 rounded">
            ←
          </button>
          <span className="text-sm text-gray-600">
            Week of {week[0].toLocaleDateString()} -{" "}
            {week[6].toLocaleDateString()}
          </span>
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            className="text-xl px-3 py-1 bg-gray-200 rounded">
            →
          </button>
        </div>

        {/* Week Day Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {week.map((date, index) => (
            <div
              key={index}
              className="bg-blue-50 text-center p-3 rounded shadow-sm">
              <p className="font-semibold">{days[index]}</p>
              <p className="text-sm text-gray-600">
                {date.getDate()}{" "}
                {date.toLocaleString("default", { month: "short" })}
              </p>
            </div>
          ))}
        </div>

        {/* Shift Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 bg-gray-100 text-left">
                  Name
                </th>
                {days.map((day, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 p-2 bg-gray-50 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((person, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{person}</td>
                  {days.map((day, d) => (
                    <td key={d} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={shiftData[person][day]}
                        onChange={(e) => {
                          const value = e.target.value;
                          setShiftData((prev) => ({
                            ...prev,
                            [person]: {
                              ...prev[person],
                              [day]: value,
                            },
                          }));
                        }}
                        className="w-full px-1 py-0.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Add shift"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
