import React, { useEffect, useState } from "react";
import axios from "axios";

const PokrivenostNastaveForm = () => {
  const [predmeti, setPredmeti] = useState([]);
  const [nastavnici, setNastavnici] = useState([]);
  const [skolskeGodine, setSkolskeGodine] = useState([]);
  const [obliciNastave, setObliciNastave] = useState([]);

  const [formData, setFormData] = useState({
    brojSatiNastave: "",
    predmetID: "",
    nastavnikID: "",
    skolskaGodinaID: "",
    oblikNastaveID: ""
  });

  /* ===============================
     UČITAVANJE ŠIFARNIKA
     =============================== */
  useEffect(() => {
    axios.get("/api/predmet").then(res => setPredmeti(res.data));
    axios.get("/api/nastavnik").then(res => setNastavnici(res.data));
    axios.get("/api/skolskagodina").then(res => setSkolskeGodine(res.data));
    axios.get("/api/obliknastave").then(res => setObliciNastave(res.data));
  }, []);

  /* ===============================
     PROMENA POLJA
     =============================== */
  const handleChange = e => {
    const { name, value } = e.target;

    // Sprečava negativne vrednosti za broj sati
    if (name === "brojSatiNastave" && Number(value) < 0) {
      return; // ignorise negativan unos
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  /* ===============================
     SUBMIT
     =============================== */
  const handleSubmit = e => {
    e.preventDefault();

    const payload = {
      brojSatiNastave: Number(formData.brojSatiNastave),
      predmet: { predmetID: formData.predmetID },
      nastavnik: { nastavnikID: formData.nastavnikID },
      skolskaGodina: { skolskaGodinaID: formData.skolskaGodinaID },
      oblikNastave: { oblikNastaveID: formData.oblikNastaveID }
    };

    axios
      .post("/api/pokrivenostnastave", payload)
      .then(() => {
        alert("Plan nastave je uspešno sačuvan.");

        setFormData({
          brojSatiNastave: "",
          predmetID: "",
          nastavnikID: "",
          skolskaGodinaID: "",
          oblikNastaveID: ""
        });
      })
      .catch(err => {
        alert("Greška prilikom čuvanja: " + err.response?.data);
      });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h3>Kreiranje plana pokrivenosti nastave</h3>

      <form onSubmit={handleSubmit}>

        {/* PREDMET */}
        <label>Predmet:</label>
        <select
          name="predmetID"
          value={formData.predmetID}
          onChange={handleChange}
          required
        >
          <option value="">-- Izaberi predmet --</option>
          {predmeti.map(p => (
            <option key={p.predmetID} value={p.predmetID}>
              {p.naziv}
            </option>
          ))}
        </select>

        <br /><br />

        {/* OBLIK NASTAVE */}
        <label>Oblik nastave:</label>
        <select
          name="oblikNastaveID"
          value={formData.oblikNastaveID}
          onChange={handleChange}
          required
        >
          <option value="">-- Izaberi oblik nastave --</option>
          {obliciNastave.map(o => (
            <option key={o.oblikNastaveID} value={o.oblikNastaveID}>
              {o.tip}
            </option>
          ))}
        </select>

        <br /><br />

        {/* ŠKOLSKA GODINA */}
        <label>Školska godina:</label>
        <select
          name="skolskaGodinaID"
          value={formData.skolskaGodinaID}
          onChange={handleChange}
          required
        >
          <option value="">-- Izaberi godinu --</option>
          {skolskeGodine.map(g => (
            <option key={g.skolskaGodinaID} value={g.skolskaGodinaID}>
              {g.godina}
            </option>
          ))}
        </select>

        <br /><br />

        {/* NASTAVNIK */}
        <label>Nastavnik:</label>
        <select
          name="nastavnikID"
          value={formData.nastavnikID}
          onChange={handleChange}
          required
        >
          <option value="">-- Izaberi nastavnika --</option>
          {nastavnici.map(n => (
            <option key={n.nastavnikID} value={n.nastavnikID}>
              {n.ime} {n.prezime}
            </option>
          ))}
        </select>

        <br /><br />

        {/* BROJ SATI */}
        <label>Broj sati nastave:</label>
        <input
          type="number"
          name="brojSatiNastave"
          value={formData.brojSatiNastave}
          onChange={handleChange}
          min="0"   // Ograničava unos na nulu ili više
          required
        />

        <br /><br />

        <button type="submit">Sačuvaj</button>
      </form>
    </div>
  );
};

export default PokrivenostNastaveForm;
