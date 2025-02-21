import { useState } from "react";
import "../styles/DataFilterApp.css";

export default function DataFilterApp() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    setError("");
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format");
      }
      const res = await fetch("http://localhost:5000/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="data-filter-app">
      <label className="label">API Input</label>
      <textarea
        className="textarea"
        rows="2"
        placeholder='{"data": ["M","1","334","4","B"]}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-section">
          <label className="label">Multi Filter</label>

          <div className="multi-filter">
            {["alphabets", "numbers", "highest_alphabet"].map((filter) => (
              <div
                key={filter}
                className={`filter-item ${
                  selectedFilters.includes(filter) ? "active" : ""
                }`}
                onClick={() => toggleFilter(filter)}
              >
                {filter.replace("_", " ")}
                <span
                  className="close-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFilter(filter);
                  }}
                >
                  ❌
                </span>
              </div>
            ))}
          </div>
          <div className="filtered-response">
            <h3 className="label">Filtered Response</h3>
            {selectedFilters.includes("numbers") && (
              <p>
                <strong>Numbers:</strong> {response.numbers.join(", ")}
              </p>
            )}
            {selectedFilters.includes("alphabets") && (
              <p>
                <strong>Alphabets:</strong> {response.alphabets.join(", ")}
              </p>
            )}
            {selectedFilters.includes("highest_alphabet") && (
              <p>
                <strong>Highest Alphabet:</strong>{" "}
                {response.highest_alphabet.join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
