import React, { useState, useEffect } from "react";
import PlanPokrivenostiNastaveForm from "./PlanPokrivenostiNastaveForm";
import PokrivenostNastaveForm from "./PokrivenostNastaveForm";
import DetaljiPokrivenostiModal from "./DetaljiPokrivenostiModal";
import Nastavnici from "./Nastavnici";
import Predmeti from "./Predmeti";
import KorisnickiProfil from "./KorisnickiProfil";
import axios from "axios";

const AdminForm = ({
  korisnickiProfilID, 
  planovi,
  skolskeGodine,
  selectedGodinaID,
  onGodinaChange,
  obrisiRed,
  setPlanovi,
  isAdmin,
  setUser,         
  setShowLogin    
}) => {
  const [view, setView] = useState("plan");
  const [showDetalji, setShowDetalji] = useState(false);
  const [detalji, setDetalji] = useState([]);

  useEffect(() => {
    if (view !== "plan") {
      onGodinaChange({ target: { value: "" } });
      setPlanovi([]);
    }
  }, [view]);

  const handleDetalji = async (predmetID) => {
    try {
      const res = await axios.get(
        `/api/pokrivenostnastave/detalji/${predmetID}/${selectedGodinaID}`
      );
      setDetalji(res.data);
      setShowDetalji(true);
    } catch (err) {
      console.error(err);
      alert("Greška pri učitavanju detalja!");
    }
  };

  const fetchPlanovi = async () => {
    if (!selectedGodinaID) return;
    try {
      const res = await axios.get(
        `/api/pokrivenostnastave/plan/${selectedGodinaID}`
      );
      setPlanovi(res.data);
    } catch (err) {
      console.error(err);
      alert("Greška prilikom osvežavanja plana!");
    }
  };

  return (
    <div>
      <h2>{isAdmin ? "Admin panel" : "Korisnički panel"}</h2>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setView("profil")}>Profil korisnika</button>
        <button onClick={() => setView("plan")} style={{ marginLeft: "10px" }}>Prikaz plana</button>
        <button onClick={() => setView("nastavnici")} style={{ marginLeft: "10px" }}>Nastavnici</button>
        <button onClick={() => setView("predmeti")} style={{ marginLeft: "10px" }}>Predmeti</button>
        {isAdmin && <button onClick={() => setView("kreiraj")} style={{ marginLeft: "10px" }}>Kreiraj plan</button>}
      </div>

      <hr />

      {view === "profil" && korisnickiProfilID && (
        <KorisnickiProfil
          korisnickiProfilID={korisnickiProfilID}
          setUser={setUser}  
          setShowLogin={setShowLogin}
        />
      )}

      {view === "plan" && (
        <PlanPokrivenostiNastaveForm
          planovi={planovi}
          skolskeGodine={skolskeGodine}
          selectedGodinaID={selectedGodinaID}
          onGodinaChange={onGodinaChange}
          obrisiRed={obrisiRed}
          isAdmin={isAdmin}
          onDetalji={handleDetalji}
        />
      )}

      {view === "kreiraj" && isAdmin && (
        <PokrivenostNastaveForm
          onCancel={() => setView("plan")}
          onSuccess={async () => {
            await fetchPlanovi();
            setView("plan");
          }}
        />
      )}

      {view === "nastavnici" && <Nastavnici />}
      {view === "predmeti" && <Predmeti />}

      {showDetalji && (
        <DetaljiPokrivenostiModal
          detalji={detalji}
          setDetalji={setDetalji}
          onClose={() => setShowDetalji(false)}
          onSave={fetchPlanovi}
        />
      )}
    </div>
  );
};

export default AdminForm;
