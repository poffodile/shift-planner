// ShiftPlanner.tsx — Now With Editable Cells, Note Popup, and Resizable Inputs
import Head from "next/head";
import { useEffect, useState } from "react";

const defaultNames = ["Sandra", "Emeka", "Precious"];

export default function ShiftPlanner() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [people, setPeople] = useState<string[]>([...defaultNames]);
  const [newName, setNewName] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [notePopup, setNotePopup] = useState({
    open: false,
    person: "",
    day: "",
    content: "",
  });

  // Compute the start of the week (Monday)
  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    monday.setDate(today.getDate() + diff + weekOffset * 7);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const columns = weekDates.map((date) => {
    const day = date.toLocaleDateString("en-GB", { weekday: "long" });
    const label = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
    return `${day} ${label}`;
  });

  const [shiftData, setShiftData] = useState<
    Record<string, Record<string, string>>
  >(() => {
    const initial: Record<string, Record<string, string>> = {};
    defaultNames.forEach((person) => {
      initial[person] = {};
      columns.forEach((day) => {
        initial[person][day] = "";
      });
    });
    return initial;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const addPerson = () => {
    if (!newName.trim()) return;
    setPeople((prev) => [...prev, newName]);
    setShiftData((prev) => ({
      ...prev,
      [newName]: columns.reduce((acc, col) => {
        acc[col] = "";
        return acc;
      }, {} as Record<string, string>),
    }));
    setNewName("");
  };

  const openNoteEditor = (person: string, day: string) => {
    setNotePopup({ open: true, person, day, content: shiftData[person][day] });
  };

  const saveNote = () => {
    const { person, day, content } = notePopup;
    setShiftData((prev) => ({
      ...prev,
      [person]: {
        ...prev[person],
        [day]: content,
      },
    }));
    setNotePopup({ open: false, person: "", day: "", content: "" });
  };

  return (
    <>
      <Head>
        <title>Shift Planner</title>
        <meta name="description" content="Weekly shift scheduling" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-6">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Weekly Shift Planner</h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="px-4 py-1 rounded bg-black text-white dark:bg-white dark:text-black">
            Toggle {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </header>

        <section className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="text-xl px-3 py-1 bg-gray-200 rounded">
            ←
          </button>
          <p className="text-md text-center">
            Week of {weekDates[0].toLocaleDateString()} –{" "}
            {weekDates[6].toLocaleDateString()}
          </p>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="text-xl px-3 py-1 bg-gray-200 rounded">
            →
          </button>
        </section>

        <section className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Add person name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={addPerson}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Row
          </button>
        </section>

        <section className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-200 text-left">Name</th>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="border p-2 bg-gray-100 text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((person, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50">
                  <td className="border p-2 font-medium whitespace-nowrap">
                    {person}
                  </td>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="border p-2">
                      <div
                        onClick={() => openNoteEditor(person, col)}
                        className="cursor-pointer min-w-[120px] max-w-[200px] truncate px-2 py-1 border rounded bg-white dark:bg-gray-800 hover:ring"
                        title={shiftData[person][col]}>
                        {shiftData[person][col] || (
                          <span className="text-gray-400">+ Add note</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Note popup modal */}
        {notePopup.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-4 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-2">
                Edit Note for {notePopup.person} – {notePopup.day}
              </h3>
              <textarea
                value={notePopup.content}
                onChange={(e) =>
                  setNotePopup((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full h-32 border rounded p-2 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    setNotePopup({
                      open: false,
                      person: "",
                      day: "",
                      content: "",
                    })
                  }
                  className="bg-gray-300 px-3 py-1 rounded">
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
