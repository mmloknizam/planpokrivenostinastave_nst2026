import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import AdminForm from "./AdminForm";
import PlanPokrivenostiNastaveForm from "./PlanPokrivenostiNastaveForm";
import RegisterForm from "./RegisterForm"; // ✅ ISPRAVLJENO

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const [planovi, setPlanovi] = useState([]);
  const [skolskeGodine, setSkolskeGodine] = useState([]);
  const [selectedGodinaID, setSelectedGodinaID] = useState("");

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPlanovi([]);
    setSelectedGodinaID("");
  };

  // Učitavanje školskih godina
  useEffect(() => {
    axios
      .get("/api/skolskagodina")
      .then((res) => setSkolskeGodine(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Učitavanje planova
  useEffect(() => {
    if (user && selectedGodinaID) {
      axios
        .get(`/api/pokrivenostnastave/plan/${selectedGodinaID}`)
        .then((res) => setPlanovi(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, selectedGodinaID]);

  return (
    <div style={{ padding: "20px" }}>
      {/* LOGIN / REGISTER */}
      {!user ? (
        showRegister ? (
          <RegisterForm onBackToLogin={() => setShowRegister(false)} /> // ✅ ISPRAVLJENO
        ) : (
          <LoginForm
            setUser={setUser}
            setShowRegister={setShowRegister}
          />
        )
      ) : (
        <>
          {/* HEADER */}
          <div style={{ marginBottom: "20px" }}>
            <span style={{ marginRight: "15px" }}>
              <b>{user.email}</b> | Uloga: <b>{user.uloga}</b>
            </span>
            <button onClick={handleLogout}>Odjavi se</button>
          </div>

          {/* ADMIN / KORISNIK */}
          {user.uloga === "Administrator" ? (
            <AdminForm
              planovi={planovi}
              skolskeGodine={skolskeGodine}
              selectedGodinaID={selectedGodinaID}
              onGodinaChange={(e) =>
                setSelectedGodinaID(e.target.value)
              }
            />
          ) : (
            <PlanPokrivenostiNastaveForm
              planovi={planovi}
              skolskeGodine={skolskeGodine}
              selectedGodinaID={selectedGodinaID}
              onGodinaChange={(e) =>
                setSelectedGodinaID(e.target.value)
              }
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
