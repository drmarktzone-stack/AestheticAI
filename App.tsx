import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { HomeScreen } from "@/screens/HomeScreen";
import { CameraCaptureScreen } from "@/screens/CameraCaptureScreen";
import { TimelineSimulatorScreen } from "@/features/timeline";

type RootScreen = "home" | "camera" | "timeline";

export default function App() {
  const [screen, setScreen] = useState<RootScreen>("home");

  return (
    <AppProviders>
      <StatusBar style="light" />
      {screen === "home" ? (
        <HomeScreen
          onOpenCamera={() => setScreen("camera")}
          onOpenTimeline={() => setScreen("timeline")}
        />
      ) : screen === "camera" ? (
        <CameraCaptureScreen onClose={() => setScreen("home")} />
      ) : (
        <TimelineSimulatorScreen onClose={() => setScreen("home")} />
      )}
    </AppProviders>
  );
}
