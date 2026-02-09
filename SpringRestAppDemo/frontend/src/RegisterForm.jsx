import React, { useState, useEffect } from "react";
import axios from "axios";

function RegisterForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");

  const [ulogaID, setUlogaID] = useState("");
  const [uloge, setUloge] = useState([]);

  const [nastavnikID, setNastavnikID] = useState("");
  const [nastavnici, setNastavnici] = useState([]);

  const [loading, setLoading] = useState(false);

  const [poruka, setPoruka] = useState("");
  const [greska, setGreska] = useState("");
  const [greskeLozinke, setGreskeLozinke] = useState([]);
  const [adminGreska, setAdminGreska] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const [kod, setKod] = useState("");
  const [adminSifra, setAdminSifra] = useState(""); // šifra za administratora

  const loadSlobodniNastavnici = () => {
    axios
      .get("/api/nastavnik/slobodni")
      .then((res) => setNastavnici(res.data))
      .catch(() => {
        setGreska("Nije moguće učitati nastavnike.");
        setShowErrorModal(true);
      });
  };

  useEffect(() => {
    axios
      .get("/api/uloga")
      .then((res) => setUloge(res.data))
      .catch(() => {
        setGreska("Nije moguće učitati uloge.");
        setShowErrorModal(true);
      });

    loadSlobodniNastavnici();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@fon\.bg\.ac\.rs$/;
    return regex.test(email)
      ? ""
      : "Email mora da se završava sa @fon.bg.ac.rs";
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("najmanje 8 karaktera");
    if (!/[A-Z]/.test(password)) errors.push("bar jedno veliko slovo");
    if (!/\d/.test(password)) errors.push("bar jedan broj");
    if (!/[@#$%^&+=!?\.]/.test(password))
      errors.push("bar jedan specijalni karakter");
    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setGreska("");
    setPoruka("");
    setAdminGreska("");

    if (!nastavnikID) {
      setGreska("Morate izabrati nastavnika.");
      setShowErrorModal(true);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setGreska(emailError);
      setShowErrorModal(true);
      return;
    }

    const passwordErrors = validatePassword(lozinka);
    if (passwordErrors.length > 0) {
      setGreskeLozinke(passwordErrors);
      setShowPasswordModal(true);
      return;
    }

    if (lozinka !== potvrdaLozinke) {
      setGreska("Lozinke se ne poklapaju.");
      setShowErrorModal(true);
      return;
    }

    if (!ulogaID) {
      setGreska("Izaberite ulogu.");
      setShowErrorModal(true);
      return;
    }

    // Provera šifre za administratora
    if (uloge.find((u) => String(u.ulogaID) === String(ulogaID))?.tip === "Administrator") {
      if (adminSifra !== "AdminFon") {
        setAdminGreska("Pogrešna šifra za registraciju kao Administrator!");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        email,
        lozinka,
        ulogaID,
        nastavnikID,
        adminSifra // <--- šaljemo backend-u
      });

      setPoruka(res.data.message || "Uspešna registracija!");
      setShowVerification(true);
      setAdminSifra("");
    } catch (err) {
      setGreska(err.response?.data || "Greška pri registraciji.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!kod) {
      setGreska("Unesite verifikacioni kod.");
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/confirm", {
        email,
        kod,
        lozinka,
        ulogaID,
        nastavnikID
      });

      setPoruka(res.data.message);
      setShowVerification(false);

      setEmail("");
      setLozinka("");
      setPotvrdaLozinke("");
      setUlogaID("");
      setNastavnikID("");
      setKod("");
      setAdminSifra("");
      loadSlobodniNastavnici();
    } catch (err) {
      setGreska(err.response?.data || "Greška pri potvrdi koda.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/resend-code", { email });
      setPoruka(res.data.message);
    } catch (err) {
      setGreska(err.response?.data || "Greška pri slanju koda.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    try {
      if (email) {
        await axios.delete(`/api/auth/delete-code/${email}`);
      }
    } catch (err) {
      console.log("Greška pri brisanju koda", err);
    }

    setEmail("");
    setLozinka("");
    setPotvrdaLozinke("");
    setUlogaID("");
    setNastavnikID("");
    setKod("");
    setAdminSifra("");
    setAdminGreska("");
    setShowVerification(false);

    loadSlobodniNastavnici();

    onBackToLogin();
  };

  return (
    <div className="auth-container">
      <h2>Registracija korisnika</h2>

      {!showVerification ? (
        <form onSubmit={handleRegister} className="auth-form">
          <select
            value={nastavnikID}
            onChange={(e) => setNastavnikID(e.target.value)}
            required
          >
            <option value="">-- Izaberi nastavnika --</option>
            {nastavnici.map((n) => (
              <option key={n.nastavnikID} value={n.nastavnikID}>
                {n.ime} {n.prezime}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Lozinka"
            value={lozinka}
            required
            onChange={(e) => setLozinka(e.target.value)}
          />

          <input
            type="password"
            placeholder="Potvrda lozinke"
            value={potvrdaLozinke}
            required
            onChange={(e) => setPotvrdaLozinke(e.target.value)}
          />

          <select
            value={ulogaID}
            onChange={(e) => {
              setUlogaID(e.target.value);
              setAdminGreska("");
              setAdminSifra("");
            }}
            required
          >
            <option value="">-- Izaberite ulogu --</option>
            {uloge.map((u) => (
              <option key={u.ulogaID} value={u.ulogaID}>
                {u.tip}
              </option>
            ))}
          </select>

          {/* Polje za šifru ako je Administrator */}
          {uloge.find((u) => String(u.ulogaID) === String(ulogaID))?.tip === "Administrator" && (
            <>
              <input
                type="password"
                placeholder="Unesite šifru za administratora"
                value={adminSifra}
                onChange={(e) => setAdminSifra(e.target.value)}
                required
              />
              {adminGreska && <p style={{ color: "red" }}>{adminGreska}</p>}
            </>
          )}

          <button disabled={loading || !nastavnikID}>
            {loading ? "Registrujem..." : "Registruj se"}
          </button>
        </form>
      ) : (
        <div className="auth-form">
          <input
            placeholder="Verifikacioni kod"
            value={kod}
            onChange={(e) => setKod(e.target.value)}
          />
          <button onClick={handleConfirmCode}>Potvrdi kod</button>
          <button onClick={handleResendCode}>Ponovo pošalji kod</button>
        </div>
      )}

      <button onClick={handleBackToLogin}>Nazad na login</button>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-a">
            <h3>Lozinka mora da sadrži:</h3>
            <ul>
              {greskeLozinke.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
            <button onClick={() => setShowPasswordModal(false)}>Zatvori</button>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal-a">
            <p>{greska}</p>
            <button onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )}

      {poruka && <p className="success-text">{poruka}</p>}
    </div>
  );
}

export default RegisterForm;
