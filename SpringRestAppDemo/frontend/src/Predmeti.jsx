import { useEffect, useState } from "react";
import axios from "axios";
import DodajPredmet from "./DodajPredmet";

function Predmeti({ isAdmin }) {
  const [predmeti, setPredmeti] = useState([]);
  const [nastavnici, setNastavnici] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchPredmeti = async () => {
    try {
      const response = await axios.get("/api/predmet");
      const data = Array.isArray(response.data) ? response.data : [];
      setPredmeti(data);

      data.forEach(p => getNastavnici(p.predmetID));
    } catch (error) {
      console.error("Greška pri učitavanju predmeta:", error);
    }
  };

  useEffect(() => {
    fetchPredmeti();
  }, []);

  const getNastavnici = async (predmetID) => {
    try {
      const response = await axios.get(`/api/predmet/${predmetID}/nastavnici`);
      const nastavniciData = Array.isArray(response.data) ? response.data : [];
      setNastavnici(prev => ({ ...prev, [predmetID]: nastavniciData }));
    } catch (error) {
      console.error(`Greška pri učitavanju nastavnika za predmet ${predmetID}:`, error);
      setNastavnici(prev => ({ ...prev, [predmetID]: [] }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h2>Lista predmeta</h2>

        {isAdmin && (
          <div>
            <button style={{ marginRight: "10px" }} onClick={() => setShowModal(true)}>
              Dodaj predmet
            </button>
            <button onClick={() => alert("Ova funkcionalnost će biti dodata kasnije")}>
              Dodaj nastavnika
            </button>
          </div>
        )}
      </div>

      {/* Tabela */}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Broj ESPB</th>
            <th>Fond predavanja</th>
            <th>Fond vežbi</th>
            <th>Fond laboratorijskih vežbi</th>
            <th>Nastavnici</th>
          </tr>
        </thead>
        <tbody>
          {predmeti.map(p => (
            <tr key={p.predmetID}>
              <td>{p.predmetID}</td>
              <td>{p.naziv}</td>
              <td>{p.brojEspb}</td>
              <td>{p.fondPredavanja}</td>
              <td>{p.fondVezbi}</td>
              <td>{p.fondLabVezbi}</td>
              <td>
                {nastavnici[p.predmetID] && nastavnici[p.predmetID].length > 0
                  ? nastavnici[p.predmetID].map(n => `${n.ime} ${n.prezime}`).join(", ")
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && showModal && (
        <DodajPredmet
          onClose={() => setShowModal(false)}
          onSaved={fetchPredmeti}
        />
      )}
    </div>
  );
}

export default Predmeti;

