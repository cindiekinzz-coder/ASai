import React, { useEffect, useState } from "react";

export default function ReflectionLog() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("dh_log") || "[]");
    setEntries(stored.reverse()); // newest first
  }, []);

  if (entries.length === 0) {
    return (
      <div className="text-center text-zinc-500 mt-20">
        No reflections yet — your log will appear here.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        Reflection Log
      </h1>
      <ul className="space-y-4">
        {entries.map((e, i) => (
          <li
            key={i}
            className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm"
          >
            <div className="text-xs text-zinc-400 mb-2">
              {new Date(e.at).toLocaleString()}
            </div>
            <p className="whitespace-pre-wrap text-zinc-800">{e.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
