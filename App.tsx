import { useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { CameraCaptureScreen } from "@/screens/CameraCaptureScreen";
import { CaseStudioScreen } from "@/screens/CaseStudioScreen";
import { DailyCheckInScreen } from "@/features/checkin";
import { colors } from "@/theme/colors";

type RootScreen = "studio" | "camera" | "checkin";

export default function App() {
  const [screen, setScreen] = useState<RootScreen>("studio");

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {screen === "studio" ? <CaseStudioScreen onOpenCamera={() => setScreen("camera")} onOpenCheckIn={() => setScreen("checkin")} /> : null}
        {screen === "camera" ? <CameraCaptureScreen onClose={() => setScreen("studio")} /> : null}
        {screen === "checkin" ? <DailyCheckInScreen onClose={() => setScreen("studio")} /> : null}
      </View>
    </AppProviders>
  );
}
