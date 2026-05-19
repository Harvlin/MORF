import { create } from "zustand";

type Theme = "light" | "dark" | "system";

export type HealthConditionDetail = {
  type: string;
  details: Record<string, string | string[]>;
  severity: "mild" | "moderate" | "significant";
  avoidances: string;
};

export type HealthProfile = {
  conditions: HealthConditionDetail[];
  hasConditions: boolean;
};

type AppState = {
  theme: Theme;
  setTheme: (t: Theme) => void;

  checkinDoneToday: boolean;
  setCheckinDone: (v: boolean) => void;

  nudgeDismissed: boolean;
  dismissNudge: () => void;

  smartReminders: boolean;
  toggleSmartReminders: () => void;

  healthPanelExpanded: boolean;
  toggleHealthPanel: () => void;

  onboarding: {
    goals: string[];
    fitnessLevel?: string;
    location?: string;
    timePerWeek?: string;
    confidence?: number;
    physical: string[];
    physicalDetails: Record<string, Partial<HealthConditionDetail>>;
    social?: string;
    notes: string;
    pickedSportId?: string;
  };
  setOnboarding: (patch: Partial<AppState["onboarding"]>) => void;
  setPhysicalDetail: (cond: string, patch: Partial<HealthConditionDetail>) => void;
  resetOnboarding: () => void;

  healthProfile: HealthProfile;
};

const defaultOnboarding = {
  goals: [],
  physical: [],
  physicalDetails: {},
  notes: "",
};

const sampleHealth: HealthProfile = {
  hasConditions: true,
  conditions: [
    {
      type: "Joint issues",
      details: { joints: ["Knee"] },
      severity: "moderate",
      avoidances: "Deep squats past 90°, jumping movements",
    },
  ],
};

export const useApp = create<AppState>((set) => ({
  theme: "dark",
  setTheme: (t) => {
    set({ theme: t });
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      const resolved =
        t === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : t;
      root.classList.add(resolved);
    }
  },

  checkinDoneToday: false,
  setCheckinDone: (v) => set({ checkinDoneToday: v }),

  nudgeDismissed: false,
  dismissNudge: () => set({ nudgeDismissed: true }),

  smartReminders: true,
  toggleSmartReminders: () => set((s) => ({ smartReminders: !s.smartReminders })),

  healthPanelExpanded: false,
  toggleHealthPanel: () => set((s) => ({ healthPanelExpanded: !s.healthPanelExpanded })),

  onboarding: { ...defaultOnboarding },
  setOnboarding: (patch) => set((s) => ({ onboarding: { ...s.onboarding, ...patch } })),
  setPhysicalDetail: (cond, patch) =>
    set((s) => ({
      onboarding: {
        ...s.onboarding,
        physicalDetails: {
          ...s.onboarding.physicalDetails,
          [cond]: { ...s.onboarding.physicalDetails[cond], ...patch },
        },
      },
    })),
  resetOnboarding: () => set({ onboarding: { ...defaultOnboarding } }),

  healthProfile: sampleHealth,
}));
