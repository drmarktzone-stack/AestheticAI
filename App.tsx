import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { HomeScreen } from "@/screens/HomeScreen";
import { CameraCaptureScreen } from "@/screens/CameraCaptureScreen";
import { TimelineSimulatorScreen } from "@/features/timeline";
import { DailyCheckInScreen } from "@/features/checkin";
import { ClinicAlertsScreen } from "@/screens/ClinicAlertsScreen";

import { AestheticWorldScreen } from "@/screens/AestheticWorldScreen";

type RootScreen =
  | "home"
  | "camera"
  | "timeline"
  | "checkin"
  | "clinicAlerts"
  | "aestheticWorld";

export default function App() {
  const [screen, setScreen] = useState<RootScreen>("home");

  return (
    <AppProviders>
      <StatusBar style="light" />
      {screen === "home" ? (
        <HomeScreen
          onOpenCamera={() => setScreen("camera")}
          onOpenTimeline={() => setScreen("timeline")}
          onOpenCheckIn={() => setScreen("checkin")}
          onOpenClinicAlerts={() => setScreen("clinicAlerts")}
          onOpenAestheticWorld={() => setScreen("aestheticWorld")}
        />
      ) : screen === "camera" ? (
        <CameraCaptureScreen onClose={() => setScreen("home")} />
      ) : screen === "timeline" ? (
        <TimelineSimulatorScreen onClose={() => setScreen("home")} />
      ) : screen === "checkin" ? (
        <DailyCheckInScreen onClose={() => setScreen("home")} />
      ) : screen === "aestheticWorld" ? (
        <AestheticWorldScreen onClose={() => setScreen("home")} />
      ) : (
        <ClinicAlertsScreen onClose={() => setScreen("home")} />
      )}
    </AppProviders>
  );
}
