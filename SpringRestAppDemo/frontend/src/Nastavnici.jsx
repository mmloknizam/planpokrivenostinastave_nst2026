import { useEffect, useState } from "react";
import axios from "axios";

function Nastavnici() {
  const [nastavnici, setNastavnici] = useState([]);
  const [predmeti, setPredmeti] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/nastavnik");
        const data = Array.isArray(response.data) ? response.data : [];
        setNastavnici(data);

        // učitaj predmete svakog nastavnika
        data.forEach(n => getPredmeti(n.nastavnikID));
      } catch (error) {
        console.error("Greška pri učitavanju nastavnika:", error);
      }
    };

    fetchData();
  }, []);

  const getPredmeti = async (nastavnikID) => {
    try {
      const response = await axios.get(`/api/nastavnik/${nastavnikID}/predmeti`);
      const predmetiData = Array.isArray(response.data) ? response.data : [];
      setPredmeti(prev => ({ ...prev, [nastavnikID]: predmetiData }));
    } catch (error) {
      console.error(`Greška pri učitavanju predmeta za nastavnika ${nastavnikID}:`, error);
      setPredmeti(prev => ({ ...prev, [nastavnikID]: [] }));
    }
  };

  return (
    <div>
      <h2>Lista nastavnika</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Zvanje</th>
            <th>Predmeti</th>
          </tr>
        </thead>
        <tbody>
          {nastavnici.map(n => (
            <tr key={n.nastavnikID}>
              <td>{n.nastavnikID}</td>
              <td>{n.ime}</td>
              <td>{n.prezime}</td>
              <td>{n.zvanje?.naziv || ""}</td>
              <td>
                {predmeti[n.nastavnikID]
                  ? predmeti[n.nastavnikID].map(p => p.naziv).join(", ")
                  : "Učitavanje..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Nastavnici;


