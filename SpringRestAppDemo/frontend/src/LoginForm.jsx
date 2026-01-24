import axios from "axios";
import { useState } from "react";

function LoginForm({ setUser, setShowRegister }) {
    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("/api/auth/login", {
                email,
                lozinka,
            });

            const userData = response.data;
            localStorage.setItem("token", userData.token);
            setUser(userData);
        } catch (error) {
            alert("Pogrešan email ili lozinka");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Lozinka"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>

            <br />
            <br />

            <button onClick={() => setShowRegister(true)}>
                Registracija
            </button>
        </div>
    );
}

export default LoginForm;


