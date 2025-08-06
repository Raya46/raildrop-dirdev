import { createContext, ReactNode, useContext, useState } from "react";

interface OnboardingData {
  phone: string;
  address: string;
  note: string;
  label: string;
  pin: string;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  clearOnboardingData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    phone: "",
    address: "",
    note: "",
    label: "",
    pin: "",
  });

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData((prevData) => ({ ...prevData, ...data }));
  };

  const clearOnboardingData = () => {
    setOnboardingData({
      phone: "",
      address: "",
      note: "",
      label: "",
      pin: "",
    });
  };

  return (
    <OnboardingContext.Provider
      value={{ onboardingData, updateOnboardingData, clearOnboardingData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
