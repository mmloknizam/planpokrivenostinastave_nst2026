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

    // Učitavanje uloga
    useEffect(() => {
        axios
            .get("/api/uloga")
            .then((res) => setUloge(res.data))
            .catch(() => setGreska("Nije moguće učitati uloge."));
    }, []);

    const validatePassword = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push("Lozinka mora imati najmanje 8 karaktera");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Lozinka mora imati bar jedno veliko slovo");
        }
        if (!/\d/.test(password)) {
            errors.push("Lozinka mora imati bar jedan broj");
        }
        if (!/[@#$%^&+=!?\.]/.test(password)) {
            errors.push(
                "Lozinka mora imati bar jedan specijalan karakter (@#$%^&+=!?.)"
            );
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGreska("");
        setPoruka("");

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
            setEmail("");
            setLozinka("");
            setPotvrdaLozinke("");
            setUlogaID("");
        } catch (err) {
            setGreska(
                err.response?.data?.message || "Greška pri registraciji."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#fafafa",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                Registracija korisnika
            </h2>

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label>Lozinka:</label>
                    <input
                        type="password"
                        required
                        value={lozinka}
                        onChange={(e) => setLozinka(e.target.value)}
                        style={inputStyle}
                    />
                    <small style={{ color: "#555" }}>
                        Min 8 karaktera, 1 veliko slovo, 1 broj, 1 specijalni
                        karakter
                    </small>
                </div>

                <div>
                    <label>Potvrda lozinke:</label>
                    <input
                        type="password"
                        required
                        value={potvrdaLozinke}
                        onChange={(e) =>
                            setPotvrdaLozinke(e.target.value)
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label>Uloga:</label>
                    <select
                        value={ulogaID}
                        onChange={(e) => setUlogaID(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">-- Izaberite ulogu --</option>
                        {uloge.map((u) => (
                            <option key={u.ulogaID} value={u.ulogaID}>
                                {u.tip}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontWeight: "bold",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                >
                    {loading ? "Registrujem..." : "Registruj se"}
                </button>
            </form>

            {/* Povratak na login */}
            <button
                onClick={onBackToLogin}
                style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "8px",
                    cursor: "pointer",
                }}
            >
                Nazad na Login
            </button>

            {greska && (
                <p style={{ color: "red", textAlign: "center", marginTop: "15px" }}>
                    {greska}
                </p>
            )}
            {poruka && (
                <p
                    style={{
                        color: "green",
                        textAlign: "center",
                        marginTop: "15px",
                    }}
                >
                    {poruka}
                </p>
            )}
        </div>
    );
}

const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

export default RegisterForm;
