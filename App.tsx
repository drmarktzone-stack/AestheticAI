import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { HomeScreen } from "@/screens/HomeScreen";
import { CameraCaptureScreen } from "@/screens/CameraCaptureScreen";

type RootScreen = "home" | "camera";

export default function App() {
  const [screen, setScreen] = useState<RootScreen>("home");

  return (
    <AppProviders>
      <StatusBar style="light" />
      {screen === "home" ? (
        <HomeScreen onOpenCamera={() => setScreen("camera")} />
      ) : (
        <CameraCaptureScreen onClose={() => setScreen("home")} />
      )}
    </AppProviders>
  );
}
