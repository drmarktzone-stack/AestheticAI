import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/app/AppProviders";
import { HomeScreen } from "@/screens/HomeScreen";

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="light" />
      <HomeScreen />
    </AppProviders>
  );
}
