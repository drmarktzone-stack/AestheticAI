import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { AppNavigation, type AppRoute } from "@/components/layout/AppNavigation";
import { HomeScreen } from "@/screens/HomeScreen";
import { CameraCaptureScreen } from "@/screens/CameraCaptureScreen";
import { TimelineSimulatorScreen } from "@/features/timeline";
import { DailyCheckInScreen } from "@/features/checkin";
import { ClinicAlertsScreen } from "@/screens/ClinicAlertsScreen";
import { colors } from "@/theme/colors";

type RootScreen = AppRoute | "camera";

export default function App() {
  const [screen, setScreen] = useState<RootScreen>("home");
  const isCamera = screen === "camera";

  return (
    <AppProviders>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>
          {screen === "home" ? (
            <HomeScreen
              onOpenCamera={() => setScreen("camera")}
              onOpenTimeline={() => setScreen("timeline")}
              onOpenCheckIn={() => setScreen("checkin")}
              onOpenClinicAlerts={() => setScreen("clinicAlerts")}
            />
          ) : screen === "camera" ? (
            <CameraCaptureScreen onClose={() => setScreen("home")} />
          ) : screen === "timeline" ? (
            <TimelineSimulatorScreen onClose={() => setScreen("home")} />
          ) : screen === "checkin" ? (
            <DailyCheckInScreen onClose={() => setScreen("home")} />
          ) : (
            <ClinicAlertsScreen onClose={() => setScreen("home")} />
          )}
        </View>
        {!isCamera ? <AppNavigation activeRoute={screen} onNavigate={setScreen} /> : null}
      </View>
    </AppProviders>
  );
}
