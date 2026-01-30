import React from "react";

const PlanPokrivenostiNastaveForm = ({
  planovi = [],
  skolskeGodine = [],
  selectedGodinaID,
  onGodinaChange,
  obrisiRed,
  isAdmin,
  onDetalji
}) => {
  return (
    <div>
      <h3>Plan pokrivenosti nastave</h3>

      <label>Školska godina: </label>
      <select className="godina-select" value={selectedGodinaID || ""} onChange={onGodinaChange}>
        <option value="">-- Izaberi godinu --</option>
        {skolskeGodine.map(g => (
          <option key={g.skolskaGodinaID} value={g.skolskaGodinaID}>
            {g.godina}
          </option>
        ))}
      </select>

      <br /><br />

      <table cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>

        <thead>
          <tr>
            <th>ID predmeta</th>
            <th>Naziv predmeta</th>
            <th>Predavanja</th>
            <th>Vežbe</th>
            <th>Laboratorijske vežbe</th>
            {isAdmin && <th>Akcije</th>}
          </tr>
        </thead>
        <tbody>
          {planovi.length > 0 ? planovi.map(p => (
            <tr key={p.predmetID}>
              <td>{p.predmetID}</td>
              <td>{p.nazivPredmeta}</td>
              <td>{p.predavanja || "-"}</td>
              <td>{p.vezbe || "-"}</td>
              <td>{p.laboratorijskeVezbe || "-"}</td>
              {isAdmin && (
                 <td className="actions-cell">
                  <button
                     className="table-btn"
                    onClick={() => {
                      if(window.confirm("Da li ste sigurni?")) obrisiRed(p.pokrivenostNastaveIDs);
                    }}
                  >
                    Obriši
                  </button>
                  <button
                    className="table-btn"
                    onClick={() => onDetalji(p.predmetID)}
                  >
                    Detalji
                  </button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan="6" align="center">Nema podataka za izabranu godinu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PlanPokrivenostiNastaveForm;
