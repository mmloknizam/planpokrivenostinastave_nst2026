import { useEffect, useState } from "react";
import axios from "axios";
import DodajNastavnika from "./DodajNastavnika";
import DodajPredmetNastavniku from "./DodajPredmetNastavniku";
import ObrisiNastavnika from "./ObrisiNastavnika";
import ObrisiPredmetZaNastavnika from "./ObrisiPredmetZaNastavnika";

function Nastavnici({ isAdmin }) {
  const [nastavnici, setNastavnici] = useState([]);
  const [predmeti, setPredmeti] = useState({});
  const [uloge, setUloge] = useState({});

  const [showDodajNastavnika, setShowDodajNastavnika] = useState(false);
  const [showDodajPredmet, setShowDodajPredmet] = useState(false);
  const [showObrisiNastavnika, setShowObrisiNastavnika] = useState(false);
  const [showObrisiPredmet, setShowObrisiPredmet] = useState(false);

  const fetchNastavnici = async () => {
    try {
      const response = await axios.get("/api/nastavnik");
      const data = Array.isArray(response.data) ? response.data : [];
      setNastavnici(data);
      data.forEach((n) => getPredmeti(n.nastavnikID));
    } catch (err) {
      console.error("Greška pri učitavanju nastavnika:", err);
    }
  };

  const getPredmeti = async (nastavnikID) => {
    try {
      const response = await axios.get(`/api/nastavnik/${nastavnikID}/predmeti`);
      setPredmeti((prev) => ({
        ...prev,
        [nastavnikID]: Array.isArray(response.data) ? response.data : [],
      }));
    } catch {
      setPredmeti((prev) => ({ ...prev, [nastavnikID]: [] }));
    }
  };

  useEffect(() => {
    fetchNastavnici();
    if (isAdmin) {
      axios
        .get("/api/nastavnik/uloge")
        .then((res) => setUloge(res.data))
        .catch((err) => console.error("Greška pri učitavanju uloga:", err));
    }
  }, [isAdmin]);

  return (
    <div>
      {/* Naslov */}
      <h2 style={{ marginBottom: "15px" }}>Lista nastavnika</h2>

      {isAdmin && (
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <button onClick={() => setShowDodajNastavnika(true)}>Dodaj nastavnika</button>
          <button onClick={() => setShowDodajPredmet(true)}>Dodaj predmet</button>
          <button onClick={() => setShowObrisiNastavnika(true)}>Obriši nastavnika</button>
          <button onClick={() => setShowObrisiPredmet(true)}>Obriši predmet</button>
        </div>
      )}

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
          {nastavnici.map((n) => (
            <tr key={n.nastavnikID}>
              <td>{n.nastavnikID}</td>
              <td>{n.ime}</td>
              <td>{n.prezime}</td>
              <td>{n.zvanje?.naziv || ""}</td>
              <td>{(predmeti[n.nastavnikID] || []).map((p) => p.naziv).join(", ") || "Nema predmeta"}</td>
              {isAdmin && <td>{uloge[n.nastavnikID] || "Nema ulogu"}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {showDodajNastavnika && (
        <DodajNastavnika
          onClose={() => setShowDodajNastavnika(false)}
          onSaved={fetchNastavnici}
        />
      )}

      {showDodajPredmet && (
        <DodajPredmetNastavniku
          onClose={() => setShowDodajPredmet(false)}
          onSaved={fetchNastavnici}
        />
      )}

      {showObrisiNastavnika && (
        <ObrisiNastavnika
          nastavnici={nastavnici}
          onClose={() => setShowObrisiNastavnika(false)}
          onDeleted={fetchNastavnici}
        />
      )}

      {showObrisiPredmet && (
        <ObrisiPredmetZaNastavnika
          nastavnici={nastavnici}
          predmeti={predmeti}
          onClose={() => setShowObrisiPredmet(false)}
          onDeleted={fetchNastavnici}
        />
      )}
    </div>
  );
}

export default Nastavnici;

