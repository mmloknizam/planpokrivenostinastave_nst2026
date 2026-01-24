import React from "react";

const PlanPokrivenostiNastaveForm = ({
  planovi = [],
  skolskeGodine = [],
  selectedGodinaID,
  onGodinaChange
}) => {
  return (
    <div>
      <h3>Plan pokrivenosti nastave</h3>

      {/* IZBOR GODINE */}
      <label>Školska godina: </label>
      <select value={selectedGodinaID || ""} onChange={onGodinaChange}>
        <option value="">-- Izaberi godinu --</option>
        {skolskeGodine.map(g => (
          <option key={g.skolskaGodinaID} value={g.skolskaGodinaID}>
            {g.godina}
          </option>
        ))}
      </select>

      <br /><br />

      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID predmeta</th>
            <th>Naziv predmeta</th>
            <th>Predavanja</th>
            <th>Vežbe</th>
            <th>Laboratorijske vežbe</th>
          </tr>
        </thead>
        <tbody>
          {planovi.length > 0 ? (
            planovi.map(p => (
              <tr key={p.predmetID}>
                <td>{p.predmetID}</td>
                <td>{p.nazivPredmeta}</td>
                <td>{p.predavanja || "-"}</td>
                <td>{p.vezbe || "-"}</td>
                <td>{p.laboratorijskeVezbe || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" align="center">
                Nema podataka za izabranu godinu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlanPokrivenostiNastaveForm;
