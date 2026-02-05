import { useEffect, useState } from "react";
import axios from "axios";

function Predmeti() {
  const [predmeti, setPredmeti] = useState([]);
  const [nastavnici, setNastavnici] = useState({}); // mapa {predmetID: [nastavnici]}

  useEffect(() => {
    const getPredmeti = async () => {
      try {
        const response = await axios.get("/api/predmet");
        const data = Array.isArray(response.data) ? response.data : [];
        setPredmeti(data);

        // učitaj nastavnike za svaki predmet
        data.forEach(p => getNastavnici(p.predmetID));
      } catch (error) {
        console.error("Greška pri učitavanju predmeta:", error);
      }
    };

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

    getPredmeti();
  }, []);

  return (
    <div>
      <h2>Lista predmeta</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Naziv</th>
            <th>Broj ESPB</th>
            <th>Fond predavanja</th>
            <th>Fond vežbi</th>
            <th>Fond laboratorijskih vežbi</th>
            <th>Aktivan</th>
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
              <td>{p.aktivan ? "Da" : "Ne"}</td>
              <td>
                {nastavnici[p.predmetID]
                  ? nastavnici[p.predmetID].map(n => `${n.ime} ${n.prezime}`).join(", ")
                  : "Učitavanje..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Predmeti;
