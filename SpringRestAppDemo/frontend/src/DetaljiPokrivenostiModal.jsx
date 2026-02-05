import React, { useState, useEffect } from "react";
import axios from "axios";

const DetaljiPokrivenostiModal = ({ detalji, setDetalji, onClose, onSave }) => {
  const [sviNastavnici, setSviNastavnici] = useState([]);

  // Učitaj sve nastavnike pri mount-u
  useEffect(() => {
    axios.get("/api/nastavnik")
      .then(res => setSviNastavnici(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, []);

  if (!Array.isArray(detalji) || detalji.length === 0) return null;

  const LIMITI = {
    "Predavanja": 60,
    "Vezbe": 60,
    "Laboratorijske vezbe": 30
  };

  const sumByOblik = (tip) =>
    detalji
      .filter(d => d.oblikNastave?.tip === tip)
      .reduce((sum, d) => sum + (d.brojSatiNastave || 0), 0);

  const handleChangeSati = (id, value) => {
    const broj = parseInt(value) || 0;
    const row = detalji.find(d => d.pokrivenostNastaveID === id);
    const maxSati = row?.oblikNastave?.tip ? LIMITI[row.oblikNastave.tip] : null;

    if (broj < 1) return;

    if (maxSati !== null && broj > maxSati) {
      alert(`Maksimalan broj sati za ${row.oblikNastave.tip} je ${maxSati}`);
      return;
    }

    setDetalji(detalji.map(d =>
      d.pokrivenostNastaveID === id
        ? { ...d, brojSatiNastave: broj }
        : d
    ));
  };

  const handleChangeNastavnik = (id, noviNastavnik) => {
    setDetalji(detalji.map(d =>
      d.pokrivenostNastaveID === id
        ? { ...d, nastavnik: noviNastavnik }
        : d
    ));
  };

  const sacuvaj = async (row) => {
    try {
      await axios.post("/api/pokrivenostnastave/detalji", row);
      alert("Izmene sačuvane!");
      onSave?.();
    } catch (err) {
      const msg = err.response?.data || "Došlo je do greške pri čuvanju.";
      alert(msg);
    }
  };

  const obrisiJednog = async (id) => {
    if (!window.confirm("Obrisati ovog nastavnika?")) return;
    try {
      await axios.delete(`/api/pokrivenostnastave/${id}`);
      setDetalji(detalji.filter(d => d.pokrivenostNastaveID !== id));
      onSave?.();
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Detalji pokrivenosti</h3>

        <div style={{ marginBottom: "12px" }}>
          <b>Predavanja:</b> {sumByOblik("Predavanja")} / 60h <br />
          <b>Vežbe:</b> {sumByOblik("Vezbe")} / 60h <br />
          <b>Laboratorijske vežbe:</b> {sumByOblik("Laboratorijske vezbe")} / 30h
        </div>

        <table>
          <thead>
            <tr>
              <th>Nastavnik</th>
              <th>Oblik nastave</th>
              <th>Sati</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {detalji.map(d => (
              <tr key={d.pokrivenostNastaveID}>
                <td>
                  <select
                    value={d.nastavnik?.nastavnikID || ""}
                    onChange={e =>
                      handleChangeNastavnik(
                        d.pokrivenostNastaveID,
                        sviNastavnici.find(
                          n => n.nastavnikID === parseInt(e.target.value)
                        )
                      )
                    }
                  >
                    <option value="">-- Izaberi nastavnika --</option>
                    {sviNastavnici.map(n => (
                      <option key={n.nastavnikID} value={n.nastavnikID}>
                        {n.ime} {n.prezime}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{d.oblikNastave?.tip || ""}</td>
                <td>
                  <input
                    type="number"
                    className="sati-input"
                    value={d.brojSatiNastave || ""}
                    onChange={e => handleChangeSati(d.pokrivenostNastaveID, e.target.value)}
                    min={1}
                    max={LIMITI[d.oblikNastave?.tip] || 100}
                  />
                </td>
                <td style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <button className="table-btn" onClick={() => sacuvaj(d)}>Sačuvaj</button>
                  <button className="table-btn" onClick={() => obrisiJednog(d.pokrivenostNastaveID)}>Obriši</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: "15px", textAlign: "right" }}>
          <button onClick={onClose}>Zatvori</button>
        </div>
      </div>
    </div>
  );
};

export default DetaljiPokrivenostiModal;


