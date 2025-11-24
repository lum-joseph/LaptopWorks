import React, { useState } from "react";
import axios from "axios";

const GATES = [
  { key: "gate1", label: "Gate 1 - Business Case" },
  { key: "gate2", label: "Gate 2 - Costing & CBA" },
  { key: "gate3", label: "Gate 3 - Solution Selection" },
];

export default function App() {
  const [files, setFiles] = useState([null, null, null, null, null]);
  const [gate, setGate] = useState(GATES[0].key);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (idx, file) => {
    const newFiles = [...files];
    newFiles[idx] = file;
    setFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.some(f => !f)) {
      alert("Please upload all 5 documents.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('gate', gate);

    const response = await axios.post("http://localhost:4000/api/process", formData, {
      responseType: "blob",
      headers: { "Content-Type": "multipart/form-data" }
    });
    setLoading(false);

    // Download output
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LaptopWorks_${gate}_output.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black font-mono">
      <div className="rounded-2xl shadow-xl p-8 max-w-lg w-full border border-black">
        <h1 className="text-3xl font-bold mb-6 text-center">LaptopWorks</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="mb-2 font-semibold">Upload 5 Documents:</p>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="mb-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="block w-full border border-black rounded-xl py-1 px-2 bg-white text-black"
                  onChange={e => handleFileChange(idx, e.target.files[0])}
                  required
                />
              </div>
            ))}
          </div>
          <div className="mb-6">
            <p className="mb-2 font-semibold">Select Gate:</p>
            <div className="flex flex-col gap-2">
              {GATES.map((g) => (
                <label key={g.key} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="gate"
                    value={g.key}
                    checked={gate === g.key}
                    onChange={() => setGate(g.key)}
                    className="mr-2 accent-black"
                  />
                  {g.label}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-xl border border-black bg-black text-white font-semibold hover:bg-white hover:text-black transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Generate Output"}
          </button>
        </form>
      </div>
    </div>
  );
}