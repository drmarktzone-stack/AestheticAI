import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { Shell } from "./components/Shell";
import { EmergencyPage } from "./screens/Emergency";
import { HomePage } from "./screens/Home";
import { HousePage } from "./screens/House";
import { JourneyPage } from "./screens/Journey";
import { PlannerPage } from "./screens/Planner";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/journey" element={<Navigate to="/journey/lips/region" replace />} />
          <Route path="/journey/:regionId" element={<JourneyPage />} />
          <Route path="/journey/:regionId/:step" element={<JourneyPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/emergency/:id" element={<EmergencyPage />} />
          <Route path="/house" element={<HousePage />} />
          <Route path="/house/:id" element={<HousePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
