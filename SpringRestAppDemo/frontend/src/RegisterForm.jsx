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
                setShowErrorModal(true);});
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

        if (password.length < 8) errors.push("Lozinka mora imati najmanje 8 karaktera");
        if (!/[A-Z]/.test(password)) errors.push("Lozinka mora imati bar jedno veliko slovo");
        if (!/\d/.test(password)) errors.push("Lozinka mora imati bar jedan broj");
        if (!/[@#$%^&+=!?\.]/.test(password))
            errors.push("Lozinka mora imati bar jedan specijalan karakter (@#$%^&+=!?.)");

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
            setGreska(passwordErrors.join(", "));
            return;
        }
        if (lozinka !== potvrdaLozinke) {
            setGreska("Lozinke se ne poklapaju.");
            return;
        }
        if (!ulogaID) {
            setGreska("Izaberite ulogu.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("/api/auth/register", {
                email,
                lozinka,
                ulogaID,
            });

            setPoruka(response.data.message || "Uspešna registracija!");
            setShowVerification(true); // Prikaži formu za unos koda
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

            const response = await axios.post("/api/auth/confirm", {
                email,
                kod,
            });

            setPoruka(response.data.message);
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
            const response = await axios.post("/api/auth/resend-code", { email });
            setPoruka(response.data.message);
        } catch (err) {
            setGreska(err.response?.data?.message || "Greška pri slanju novog koda.");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Registracija korisnika</h2>

            {!showVerification ? (
                <form onSubmit={handleRegister} style={formStyle}>
                    <div>
                        <label>Email:</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                        <label>Lozinka:</label>
                        <input type="password" required value={lozinka} onChange={(e) => setLozinka(e.target.value)} style={inputStyle} />
                        <small style={{ color: "#555" }}>
                            Min 8 karaktera, 1 veliko slovo, 1 broj, 1 specijalni karakter
                        </small>
                    </div>

                    <div>
                        <label>Potvrda lozinke:</label>
                        <input type="password" required value={potvrdaLozinke} onChange={(e) => setPotvrdaLozinke(e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                        <label>Uloga:</label>
                        <select value={ulogaID} onChange={(e) => setUlogaID(e.target.value)} style={inputStyle}>
                            <option value="">-- Izaberite ulogu --</option>
                            {uloge.map((u) => (
                                <option key={u.ulogaID} value={u.ulogaID}>{u.tip}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? "Registrujem..." : "Registruj se"}
                    </button>
                </form>
            ) : (
                <div style={formStyle}>
                    <p>Proverite mejl i unesite kod za potvrdu naloga.</p>
                    <input type="text" placeholder="Verifikacioni kod" value={kod} onChange={(e) => setKod(e.target.value)} style={inputStyle} />
                    <button onClick={handleConfirmCode} disabled={loading} style={buttonStyle}>
                        {loading ? "Potvrđujem..." : "Potvrdi kod"}
                    </button>
                    <button onClick={handleResendCode} disabled={loading} style={buttonStyle}>
                        {loading ? "Šaljem..." : "Ponovo pošalji kod"}
                    </button>
                </div>
            )}

            <button onClick={onBackToLogin} style={backButtonStyle}>Nazad na Login</button>

            {greska && <p style={errorStyle}>{greska}</p>}
            {poruka && <p style={successStyle}>{poruka}</p>}
        </div>
    );
}

const containerStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fafafa",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

const buttonStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
};

const backButtonStyle = {
    marginTop: "15px",
    width: "100%",
    padding: "8px",
    cursor: "pointer",
};

const errorStyle = {
    color: "red",
    textAlign: "center",
    marginTop: "15px",
};

const successStyle = {
    color: "green",
    textAlign: "center",
    marginTop: "15px",
};

export default RegisterForm;