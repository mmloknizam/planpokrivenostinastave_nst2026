import React, { useState, useEffect } from "react";
import axios from "axios";

function RegisterForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [potvrdaLozinke, setPotvrdaLozinke] = useState("");
  const [ulogaID, setUlogaID] = useState("");
  const [uloge, setUloge] = useState([]);

  const [loading, setLoading] = useState(false);
  const [poruka, setPoruka] = useState("");
  const [greska, setGreska] = useState("");

  const [greskeLozinke, setGreskeLozinke] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const [showVerification, setShowVerification] = useState(false);
  const [kod, setKod] = useState("");

  useEffect(() => {
    axios
      .get("/api/uloga")
      .then((res) => setUloge(res.data))
      .catch(() => {
        setGreska("Nije moguće učitati uloge.");
        setShowErrorModal(true);
      });
  }, []);

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@fon\.bg\.ac\.rs$/;
    if (!regex.test(email)) {
      return "Email mora da se završava sa @fon.bg.ac.rs";
    }
    return "";
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

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/register", {
        email,
        lozinka,
        ulogaID,
      });

      setPoruka(res.data.message || "Uspešna registracija!");
      setShowVerification(true);
    } catch (err) {
      setGreska(err.response?.data?.message || "Greška pri registraciji.");
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
      const res = await axios.post("/api/auth/confirm", { email, kod, lozinka, ulogaID});
      setPoruka(res.data.message);
      setShowVerification(false);
      setEmail("");
      setLozinka("");
      setPotvrdaLozinke("");
      setUlogaID("");
      setKod("");
    } catch (err) {
      setGreska(err.response?.data?.message || "Greška pri potvrdi koda.");
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
      setGreska(err.response?.data?.message || "Greška pri slanju koda.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Registracija korisnika</h2>

      {!showVerification ? (
        <form onSubmit={handleRegister} className="auth-form">
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

          <select value={ulogaID} onChange={(e) => setUlogaID(e.target.value)}>
            <option value="">-- Izaberite ulogu --</option>
            {uloge.map((u) => (
              <option key={u.ulogaID} value={u.ulogaID}>
                {u.tip}
              </option>
            ))}
          </select>

          <button disabled={loading}>
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

      <button onClick={onBackToLogin}>Nazad na login</button>

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