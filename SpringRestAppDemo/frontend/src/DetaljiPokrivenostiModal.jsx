import React, { useState } from "react";
import PlanPokrivenostiNastaveForm from "./PlanPokrivenostiNastaveForm";
import PokrivenostNastaveForm from "./PokrivenostNastaveForm";

const AdminForm = ({
  planovi,
  skolskeGodine,
  selectedGodinaID,
  onGodinaChange
}) => {
  const [view, setView] = useState("plan");

  return (
    <div>
      <h2>Admin panel</h2>

      <button onClick={() => setView("plan")}>Prikaz plana</button>
      <button onClick={() => setView("kreiraj")} style={{ marginLeft: "10px" }}>
        Kreiraj plan
      </button>

      <hr />

      {view === "plan" && (
        <PlanPokrivenostiNastaveForm
          planovi={planovi}
          skolskeGodine={skolskeGodine}
          selectedGodinaID={selectedGodinaID}
          onGodinaChange={onGodinaChange}
        />
      )}

      {view === "kreiraj" && <PokrivenostNastaveForm />}
    </div>
  );
};

export default AdminForm;
