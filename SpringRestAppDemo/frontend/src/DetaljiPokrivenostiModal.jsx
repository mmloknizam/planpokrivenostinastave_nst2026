import React from "react";
import axios from "axios";

const DetaljiPokrivenostiModal = ({ detalji, setDetalji, onClose, onSave }) => {

  const [sviNastavnici, setSviNastavnici] = React.useState([]);

  React.useEffect(() => {
    axios.get("/api/nastavnik")
      .then(res => setSviNastavnici(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!detalji) return null;

  const handleChangeSati = (id, value) => {
    setDetalji(detalji.map(d =>
      d.pokrivenostNastaveID === id
        ? { ...d, brojSatiNastave: parseInt(value) }
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
      await axios.post("/api/pokrivenostnastave", row);
      alert("Izmene sačuvane!");
      onSave?.();
    } catch (err) {
      console.error(err);
      alert("Greška pri čuvanju!");
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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Detalji pokrivenosti</h3>
        <table border="1" cellPadding="5" width="100%">
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
                <td>{d.oblikNastave.tip}</td>
                <td>
                  <input
                    type="number"
                    value={d.brojSatiNastave}
                    onChange={e =>
                      handleChangeSati(d.pokrivenostNastaveID, e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => sacuvaj(d)}>Sačuvaj</button>
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => obrisiJednog(d.pokrivenostNastaveID)}
                  >
                    Obriši
                  </button>
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

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0, width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex", justifyContent: "center", alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  width: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
  borderRadius: "6px"
};

export default DetaljiPokrivenostiModal;

