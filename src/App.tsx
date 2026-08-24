import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { HomePage } from "./pages/Home";
import { MaterialsPage, MaterialDetailPage } from "./pages/Materials";
import { RegionsPage, RegionDetailPage } from "./pages/Regions";
import { TechniquesPage, TechniqueDetailPage } from "./pages/Techniques";
import { ProtocolsPage, ProtocolDetailPage } from "./pages/Protocols";
import { EmergencyPage, EmergencyDetailPage } from "./pages/Emergency";
import { PlannerPage } from "./pages/Planner";
import { SimulationPage } from "./pages/Simulation";
import { ConsultationPage } from "./pages/Consultation";
import { LibraryPage } from "./pages/Library";
import { MentorIndexPage, MentorPage } from "./pages/Mentor";
import { CompaniesPage, CompanyDetailPage } from "./pages/Companies";
import { WorldPage, WorldDomainPage, WorldProductDetailPage } from "./pages/World";
import { EvidencePage, EvidenceDetailPage } from "./pages/Evidence";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
      <Shell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/world" element={<WorldPage />} />
          <Route path="/world/:domain" element={<WorldDomainPage />} />
          <Route path="/world/:domain/:productId" element={<WorldProductDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/evidence/:id" element={<EvidenceDetailPage />} />
          <Route path="/guide" element={<MentorIndexPage />} />
          <Route path="/guide/:regionId" element={<MentorPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/materials/:id" element={<MaterialDetailPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/regions/:id" element={<RegionDetailPage />} />
          <Route path="/techniques" element={<TechniquesPage />} />
          <Route path="/techniques/:id" element={<TechniqueDetailPage />} />
          <Route path="/protocols" element={<ProtocolsPage />} />
          <Route path="/protocols/:id" element={<ProtocolDetailPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/emergency/:id" element={<EmergencyDetailPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
