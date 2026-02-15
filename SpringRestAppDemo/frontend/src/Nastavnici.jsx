import { useEffect, useState } from "react";
import axios from "axios";
import DodajNastavnika from "./DodajNastavnika";

function Nastavnici({ isAdmin }) {
  const [nastavnici, setNastavnici] = useState([]);
  const [predmeti, setPredmeti] = useState({});
  const [uloge, setUloge] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchNastavnici = async () => {
    try {
      const response = await axios.get("/api/nastavnik");
      const data = Array.isArray(response.data) ? response.data : [];
      setNastavnici(data);

      data.forEach(n => getPredmeti(n.nastavnikID));
    } catch (error) {
      console.error("Greška pri učitavanju nastavnika:", error);
    }
  };

  useEffect(() => {
    fetchNastavnici();

    if (isAdmin) {
      axios.get("/api/nastavnik/uloge")
        .then(res => setUloge(res.data))
        .catch(err => console.error("Greška pri učitavanju uloga:", err));
    }
  }, [isAdmin]);

  const getPredmeti = async (nastavnikID) => {
    try {
      const response = await axios.get(`/api/nastavnik/${nastavnikID}/predmeti`);
      setPredmeti(prev => ({
        ...prev,
        [nastavnikID]: Array.isArray(response.data) ? response.data : []
      }));
    } catch {
      setPredmeti(prev => ({ ...prev, [nastavnikID]: [] }));
    }
  };

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      }}>
        <h2>Lista nastavnika</h2>

        {isAdmin && (
          <div>
            <button
              style={{ marginRight: "10px" }}
              onClick={() => setShowModal(true)}
            >
              Dodaj nastavnika
            </button>

            <button>
              Dodaj predmet
            </button>
          </div>
        )}
      </div>

      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Zvanje</th>
            <th>Predmeti</th>
            {isAdmin && <th>Uloga</th>}
          </tr>
        </thead>

        <tbody>
          {nastavnici.map(n => (
            <tr key={n.nastavnikID}>
              <td>{n.nastavnikID}</td>
              <td>{n.ime}</td>
              <td>{n.prezime}</td>
              <td>{n.zvanje?.naziv || ""}</td>

              {/* FIX: nema više "Učitavanje..." */}
              <td>
                {(predmeti[n.nastavnikID] || [])
                  .map(p => p.naziv)
                  .join(", ")}
              </td>

              {isAdmin && (
                <td>
                  {uloge[n.nastavnikID] || "Nema ulogu"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <DodajNastavnika
          onClose={() => setShowModal(false)}
          onSaved={fetchNastavnici}
        />
      )}
    </div>
  );
}

export default Nastavnici;

