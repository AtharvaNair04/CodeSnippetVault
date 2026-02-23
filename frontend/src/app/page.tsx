"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Snippet {
  id: number;
  title: string;
  language: string;
  code: string;
  created_at: string;
}

export default function Home() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchSnippets = async () => {
    const res = await fetch(`${API_URL}/snippets`);
    const data = await res.json();
    setSnippets(data);
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const handleAdd = async () => {
    if (!title || !language || !code) return;

    await fetch(`${API_URL}/snippets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, language, code }),
    });

    setTitle("");
    setCode("");
    fetchSnippets();
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/snippets/${id}`, {
      method: "DELETE",
    });

    fetchSnippets();
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch = snippet.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || snippet.language === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-10">

      {/* HEADER */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Code Snippet Vault
        </h1>

        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700"
          >
            <option>All</option>
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>
        </div>
      </div>

      {/* ADD FORM */}
      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 mb-10 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">
          Add New Snippet
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700"
          />

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700"
          >
            <option>JavaScript</option>
            <option>Python</option>
            <option>Java</option>
            <option>C++</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-4 py-2 font-medium"
          >
            Add
          </button>
        </div>

        <textarea
          placeholder="Paste your code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-700"
        />
      </div>

      {/* CARDS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl hover:scale-105 transition transform flex flex-col h-72"
          >
            {/* TITLE 1/4 */}
            <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold text-indigo-400 truncate">
                {snippet.title}
              </h3>
              <button
                onClick={() => handleDelete(snippet.id)}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </div>

            {/* CODE 3/4 */}
            <div className="flex-1 p-4 bg-black/60 overflow-hidden">
              <pre className="text-xs text-gray-300 overflow-auto h-full">
                {snippet.code}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}