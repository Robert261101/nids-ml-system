import { useState } from "react";
import Papa from "papaparse";
import { predictFlows } from "../services/api";

export default function CsvUpload() {
  const [status, setStatus] = useState("");
  const [rowsSent, setRowsSent] = useState(0);
  const [benign, setBenign] = useState(0);
  const [attack, setAttack] = useState(0);

  const N = 50;

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Parsing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;

          // take first N rows
          const sample = rows.slice(0, N);

          // convert to your backend format: [{ features: {...}}, ...]
          const flows = sample.map((r) => ({ features: r }));

          setRowsSent(flows.length);
          setStatus("Sending to backend...");

          const out = await predictFlows(flows);

          const preds = out.predictions || [];
          const benignCount = preds.filter((p) => p.label === 0).length;
          const attackCount = preds.filter((p) => p.label === 1).length;

          setBenign(benignCount);
          setAttack(attackCount);
          setStatus("Done.");
        } catch (err) {
          console.error(err);
          setStatus("Error: " + err.message);
        }
      },
      error: (err) => {
        setStatus("Parse error: " + err.message);
      },
    });
  };

  return (
    <div style={{ padding: 16, maxWidth: 700 }}>
      <h2>CSV Upload → Predict</h2>

      <input type="file" accept=".csv" onChange={onFileChange} />

      <p><b>Status:</b> {status}</p>

      <div>
        <p><b>Rows sent:</b> {rowsSent}</p>
        <p><b>Predicted BENIGN:</b> {benign}</p>
        <p><b>Predicted ATTACK:</b> {attack}</p>
      </div>
    </div>
  );
}