import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { Shell } from "./components/Shell";
import { AtlasPage } from "./screens/Atlas";
import { EmergencyPage } from "./screens/Emergency";
import { HomePage } from "./screens/Home";
import { HousePage } from "./screens/House";
import { JourneyPage } from "./screens/Journey";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<Navigate to="/" replace />} />
          <Route path="/atlas" element={<AtlasPage />} />
          <Route path="/journey" element={<Navigate to="/atlas" replace />} />
          <Route path="/journey/:regionId" element={<JourneyPage />} />
          <Route path="/journey/:regionId/:step" element={<JourneyPage />} />
          <Route path="/emergency" element={<Navigate to="/emergency/vascular-occlusion" replace />} />
          <Route path="/emergency/:id" element={<EmergencyPage />} />
          <Route path="/house" element={<HousePage />} />
          <Route path="/house/:id" element={<HousePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
