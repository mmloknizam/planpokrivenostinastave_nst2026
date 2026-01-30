import React, { useEffect, useState }
from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import AdminForm from "./AdminForm";
import PlanPokrivenostiNastaveForm from "./PlanPokrivenostiNastaveForm";
import RegisterForm from "./RegisterForm";
import "./App.css";


function App() {
const [user, setUser] = useState(null);
        const [showRegister, setShowRegister] = useState(false);
        const [planovi, setPlanovi] = useState([]);
        const [skolskeGodine, setSkolskeGodine] = useState([]);
        const [selectedGodinaID, setSelectedGodinaID] = useState("");
        const handleLogout = () => {
localStorage.removeItem("token");
        setUser(null);
        setPlanovi([]);
        setSelectedGodinaID("");
};
        const obrisiRed = async(ids) => {
try{
await axios.delete("/api/pokrivenostnastave", {data: ids});
        const res = await axios.get(`/api/pokrivenostnastave/plan/${selectedGodinaID}`);
        setPlanovi(res.data);
} catch (err){
console.error(err);
        alert("Greška pri brisanju reda!");
}
};
        useEffect(() => {
        axios
                .get("/api/skolskagodina")
                .then((res) => setSkolskeGodine(res.data))
                .catch((err) => console.error(err));
        }, []);
        useEffect(() => {
        if (user && selectedGodinaID) {
        axios
                .get(`/api/pokrivenostnastave/plan/${selectedGodinaID}`)
                .then((res) => setPlanovi(res.data))
                .catch((err) => console.error(err));
        }
        }, [user, selectedGodinaID]);
        return (
                <div className="app-container">
    {!user ? (
                        showRegister ? (
                                <RegisterForm onBackToLogin={() => setShowRegister(false)} />
                                ) : (
                        <LoginForm
        setUser={setUser}
        setShowRegister={setShowRegister}
        />
                        )
                        ) : (
                <>
    <div className="user-bar">
        <span className="user-info">
            <b>{user.email}</b> | Uloga: <b>{user.uloga}</b>
        </span>
        <button onClick={handleLogout}>Odjavi se</button>
    </div>


    {user.uloga === "Administrator" ? (
                        <AdminForm
        planovi={planovi}
        skolskeGodine={skolskeGodine}
        selectedGodinaID={selectedGodinaID}
        onGodinaChange={(e) =>
                        setSelectedGodinaID(e.target.value)
        }
        obrisiRed={obrisiRed}
        setPlanovi={setPlanovi}
        />
                        ) : (
                <PlanPokrivenostiNastaveForm
        planovi={planovi}
        skolskeGodine={skolskeGodine}
        selectedGodinaID={selectedGodinaID}
        onGodinaChange={(e) =>
                setSelectedGodinaID(e.target.value)
        }
        obrisiRed={obrisiRed}
        isAdmin={false}
        />
                )}
    </>
    )}
</div>
                );
}

export default App;