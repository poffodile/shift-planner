import Head from "next/head";
import { useState } from "react";

// === Main Weekly Planner Page ===
export default function Planner() {
  // Keeps track of which week we're viewing (0 = current, -1 = previous week, etc.)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // These are the people we're showing in the table
  const people = ["Sandra", "Emeka", "Precious"];

  // These are the 7 days we want to display
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // State to store what shift someone is doing on a given day
  const [shiftData, setShiftData] = useState(() => {
    const init: { [person: string]: { [day: string]: string } } = {};
    people.forEach((name) => {
      init[name] = {};
      days.forEach((day) => {
        init[name][day] = ""; // empty by default
      });
    });
    return init;
  });

  // State to store notes per cell (e.g. "slept 3 hrs", etc.)
  const [noteData, setNoteData] = useState(() => {
    const init: { [person: string]: { [day: string]: string } } = {};
    people.forEach((name) => {
      init[name] = {};
      days.forEach((day) => {
        init[name][day] = "";
      });
    });
    return init;
  });

  // When someone clicks the note icon, this opens the modal
  const [notePopup, setNotePopup] = useState({
    person: "",
    day: "",
    open: false,
  });

  const [noteText, setNoteText] = useState("");

  // Generate dates for the current selected week
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

        {/* Arrows to move between weeks */}
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

        {/* Day labels with dates */}
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
                  <td className="border border-gray-300 p-2 font-medium">
                    {person}
                  </td>
                  {days.map((day, d) => (
                    <td key={d} className="border border-gray-300 p-2">
                      <div className="flex items-center gap-1">
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
                        <button
                          onClick={() => {
                            setNotePopup({ person, day, open: true });
                            setNoteText(noteData[person][day]);
                          }}
                          className="text-xs text-blue-500"
                          title="Add note">
                          📝
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note Modal */}
        {notePopup.open && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow-md w-80">
              <h3 className="text-lg font-bold mb-2">
                Note for {notePopup.person} on {notePopup.day}
              </h3>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="e.g. Slept 2 hrs, left early"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    setNotePopup({ person: "", day: "", open: false })
                  }
                  className="px-3 py-1 bg-gray-300 rounded">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setNoteData((prev) => ({
                      ...prev,
                      [notePopup.person]: {
                        ...prev[notePopup.person],
                        [notePopup.day]: noteText,
                      },
                    }));
                    setNotePopup({ person: "", day: "", open: false });
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
