import { OnboardingProvider } from "@/context/OnboardingContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </OnboardingProvider>
  );
}
