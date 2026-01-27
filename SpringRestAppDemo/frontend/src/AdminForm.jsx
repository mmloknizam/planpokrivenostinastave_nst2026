import React, { useState } from "react";
import PlanPokrivenostiNastaveForm from "./PlanPokrivenostiNastaveForm";
import PokrivenostNastaveForm from "./PokrivenostNastaveForm";
import DetaljiPokrivenostiModal from "./DetaljiPokrivenostiModal";
import axios from "axios";

const AdminForm = ({
  planovi, skolskeGodine, selectedGodinaID,
  onGodinaChange, obrisiRed, setPlanovi
}) => {

  const [view, setView] = useState("plan");
  const [showDetalji, setShowDetalji] = useState(false);
  const [detalji, setDetalji] = useState([]);

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
      const res = await axios.get(`/api/pokrivenostnastave/plan/${selectedGodinaID}`);
      setPlanovi(res.data);
    } catch (err) {
      console.error(err);
      alert("Greška prilikom osvežavanja plana!");
    }
  };

  return (
    <div>
      <h2>Admin panel</h2>

      <button onClick={() => setView("plan")}>Prikaz plana</button>
      <button onClick={() => setView("kreiraj")} style={{ marginLeft: "10px" }}>Kreiraj plan</button>
      <hr />

      {view === "plan" && (
        <PlanPokrivenostiNastaveForm
          planovi={planovi}
          skolskeGodine={skolskeGodine}
          selectedGodinaID={selectedGodinaID}
          onGodinaChange={onGodinaChange}
          obrisiRed={obrisiRed}
          isAdmin={true}
          onDetalji={handleDetalji}
        />
      )}

      {view === "kreiraj" && (
        <PokrivenostNastaveForm
          onCancel={() => setView("plan")}
          onSuccess={async () => {
            await fetchPlanovi();
            setView("plan");
          }}
        />
      )}

      {showDetalji && (
        <DetaljiPokrivenostiModal
          detalji={detalji}
          setDetalji={setDetalji}
          onClose={() => setShowDetalji(false)}
          onSave={fetchPlanovi} // automatski refresh tabele
        />
      )}
    </div>
  );
};

export default AdminForm;


