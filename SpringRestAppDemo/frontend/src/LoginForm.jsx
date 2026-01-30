import axios from "axios";
import { useState } from "react";

function LoginForm( { setUser, setShowRegister }) {
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
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                <h2>Login</h2>
            
                <div className="login-row">
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
            
                    <button type="button" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            
                <div className="register-row">
                    <span>Nemaš nalog?</span>
                    <button
                        type="button"
                        className="register-btn"
                        onClick={() => setShowRegister(true)}
                        >
                        Registruj se
                    </button>
                </div>
            </form>

            );
}

export default LoginForm;

