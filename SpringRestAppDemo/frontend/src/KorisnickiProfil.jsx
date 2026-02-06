import React, { useState, useEffect } from "react";
import axios from "axios";

const KorisnickiProfil = ({ korisnickiProfilID, setUser, setShowLogin }) => {
  const [profil, setProfil] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [zvanja, setZvanja] = useState([]);
  const [uloge, setUloge] = useState([]);
  const [poruka, setPoruka] = useState("");
  const [greska, setGreska] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const profilRes = await axios.get(`/api/auth/profil/${korisnickiProfilID}`);
        setProfil(profilRes.data);
        setFormData({
          zvanjeID: profilRes.data.zvanjeID,
          ulogaID: profilRes.data.ulogaID,
          staraLozinka: "",
          novaLozinka: "",
          potvrdaNoveLozinke: "",
          lozinkaZaBrisanje: ""
        });

        const ulogeRes = await axios.get("/api/auth/uloge");
        setUloge(ulogeRes.data);

        const zvanjaRes = await axios.get("/api/auth/zvanja");
        setZvanja(zvanjaRes.data);

      } catch (err) {
        setGreska(err.response?.data || "Greška pri učitavanju podataka.");
      }
    };
    loadData();
  }, [korisnickiProfilID]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    if (profil) {
      setFormData({
        zvanjeID: profil.zvanjeID,
        ulogaID: profil.ulogaID,
        staraLozinka: "",
        novaLozinka: "",
        potvrdaNoveLozinke: "",
        lozinkaZaBrisanje: ""
      });
    }
    setIsEdit(false);
    setShowPasswordEdit(false);
    setShowDeleteConfirm(false);
    setPoruka("");
    setGreska("");
  };

  const handleSave = async () => {
    try {
      const izmena = { zvanjeID: formData.zvanjeID, ulogaID: formData.ulogaID };
      const res = await axios.put(`/api/auth/profil/${korisnickiProfilID}`, izmena);
      setProfil(res.data);
      setIsEdit(false);
      setPoruka("Profil uspešno sačuvan!");
    } catch (err) {
      setGreska(err.response?.data || "Greška pri čuvanju profila.");
    }
  };

  const handlePasswordChange = async () => {
    if (formData.novaLozinka !== formData.potvrdaNoveLozinke) {
      setGreska("Lozinke se ne poklapaju!");
      return;
    }
    try {
      const dto = { staraLozinka: formData.staraLozinka, novaLozinka: formData.novaLozinka };
      await axios.put(`/api/auth/profil/${korisnickiProfilID}/lozinka`, dto);
      setPoruka("Lozinka uspešno promenjena!");
      setFormData({ ...formData, staraLozinka: "", novaLozinka: "", potvrdaNoveLozinke: "" });
      setShowPasswordEdit(false);
    } catch (err) {
      setGreska(err.response?.data || "Greška pri promeni lozinke.");
    }
  };

  const handleDelete = async () => {
    if (!formData.lozinkaZaBrisanje) {
      setGreska("Unesite trenutnu lozinku!");
      return;
    }
    try {
      await axios.delete(`/api/auth/profil/${korisnickiProfilID}`, {
        data: { lozinka: formData.lozinkaZaBrisanje },
      });

      setPoruka("Profil uspešno obrisan!");

      // Automatski logout i prikaz login forme nakon 1 sekunde
      setTimeout(() => {
        setUser(null);
        setShowLogin(true);
      }, 1000);

    } catch (err) {
      setGreska(err.response?.data || "Greška pri brisanju profila.");
    }
  };

  if (!profil) return <p>Učitavanje profila...</p>;

  return (
    <div style={{ maxWidth: "520px" }}>
      <h3>Moj profil</h3>
      {greska && <p style={{ color: "red" }}>{greska}</p>}
      {poruka && <p style={{ color: "green" }}>{poruka}</p>}

      <label>Ime</label>
      <input type="text" value={profil.ime} disabled />

      <label>Prezime</label>
      <input type="text" value={profil.prezime} disabled />

      <label>Email</label>
      <input type="email" value={profil.email} disabled />

      <label>Zvanje</label>
      <select name="zvanjeID" value={formData.zvanjeID} onChange={handleChange} disabled={!isEdit}>
        {zvanja.map((z) => <option key={z.zvanjeID} value={z.zvanjeID}>{z.naziv}</option>)}
      </select>

      <label>Uloga</label>
      <select name="ulogaID" value={formData.ulogaID} onChange={handleChange} disabled={!isEdit}>
        {uloge.map((u) => <option key={u.ulogaID} value={u.ulogaID}>{u.tip}</option>)}
      </select>

      <div style={{ marginTop: "15px" }}>
        {!isEdit && !showDeleteConfirm && (
          <>
            <button onClick={() => setIsEdit(true)}>Izmeni profil</button>
            <button onClick={() => setShowDeleteConfirm(true)} style={{ marginLeft: "10px" }}>Obriši profil</button>
          </>
        )}
        {isEdit && (
          <>
            <button onClick={handleSave}>Sačuvaj</button>
            <button onClick={handleCancel} style={{ marginLeft: "10px" }}>Otkaži</button>
            <button onClick={() => setShowPasswordEdit(!showPasswordEdit)} style={{ marginLeft: "10px" }}>Izmeni lozinku</button>
          </>
        )}
      </div>

      {showPasswordEdit && (
        <>
          <hr />
          <h4>Promena lozinke</h4>
          <label>Stara lozinka</label>
          <input type="password" name="staraLozinka" value={formData.staraLozinka} onChange={handleChange} />
          <label>Nova lozinka</label>
          <input type="password" name="novaLozinka" value={formData.novaLozinka} onChange={handleChange} />
          <label>Potvrdi novu lozinku</label>
          <input type="password" name="potvrdaNoveLozinke" value={formData.potvrdaNoveLozinke} onChange={handleChange} />
          <button onClick={handlePasswordChange}>Promeni lozinku</button>
        </>
      )}

      {showDeleteConfirm && (
        <>
          <hr />
          <h4>Potvrda brisanja profila</h4>
          <label>Trenutna lozinka</label>
          <input type="password" name="lozinkaZaBrisanje" value={formData.lozinkaZaBrisanje} onChange={handleChange} />
          <button onClick={handleDelete} style={{ marginTop: "10px" }}>Potvrdi brisanje</button>
          <button onClick={handleCancel} style={{ marginLeft: "10px" }}>Otkaži</button>
        </>
      )}
    </div>
  );
};

export default KorisnickiProfil;
