import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import type { SurveyFormData } from "../lib/types";

const GYM_FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  "4-6": "4–6 times per week",
  "2-3": "2–3 times per week",
  once: "Once a week",
  rarely: "Rarely",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
};

const FRUSTRATION_LABELS: Record<string, string> = {
  crowded: "Too crowded",
  wait: "Long wait times for machines",
  intimidating: "Intimidating environment",
  guidance: "Lack of guidance/workout plan",
  dirty: "Dirty equipment",
  other: "Other",
};

const TIME_LABELS: Record<string, string> = {
  early_morning: "Early morning (5–8 AM)",
  late_morning: "Late morning (8–11 AM)",
  afternoon: "Afternoon (12–4 PM)",
  evening: "Evening (5–8 PM)",
  night: "Night (8 PM+)",
};

const ANXIETY_LABELS: Record<string, string> = {
  yes_often: "Yes, often",
  sometimes: "Sometimes",
  rarely: "Rarely",
  never: "Never",
};

const IMPROVEMENT_LABELS: Record<string, string> = {
  less_crowded: "Less crowded environment",
  structured: "Structured workouts provided",
  smaller_groups: "Smaller group settings",
  better_equipment: "Better equipment availability",
  beginner_friendly: "More beginner-friendly atmosphere",
};

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state as SurveyFormData | null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No submission found
            </h1>
            <button
              onClick={() => navigate("/survey")}
              className="px-6 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#8A3BDB" }}
            >
              Take the Survey
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const frustrationsDisplay = data.frustrations
    .map((f) =>
      f === "other" && data.frustrationsOther
        ? `Other: ${data.frustrationsOther}`
        : FRUSTRATION_LABELS[f] ?? f
    )
    .join(", ");

  const improvementsDisplay = data.improvements
    .map((i) => IMPROVEMENT_LABELS[i] ?? i)
    .join(", ");

  const summaryItems = [
    {
      label: "How often do you go to the gym?",
      value: GYM_FREQUENCY_LABELS[data.gymFrequency] ?? data.gymFrequency,
    },
    {
      label: "How would you rate your gym experience?",
      value: EXPERIENCE_LABELS[data.experienceRating] ?? data.experienceRating,
    },
    {
      label: "What frustrates you most at the gym?",
      value: frustrationsDisplay,
    },
    {
      label: "What time do you usually go to the gym?",
      value: TIME_LABELS[data.gymTime] ?? data.gymTime,
    },
    {
      label: "Do you feel anxious at the gym?",
      value: ANXIETY_LABELS[data.gymAnxiety] ?? data.gymAnxiety,
    },
    {
      label: "What is your biggest challenge at the gym?",
      value: data.biggestChallenge,
    },
    {
      label: "What would improve your gym experience?",
      value: improvementsDisplay,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "#f3ebfd" }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: "#8A3BDB" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank you!
            </h1>
            <p className="text-gray-600">
              Your response has been recorded. Here's a summary of your answers.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div
              className="px-6 py-4 border-b border-gray-100"
              style={{ backgroundColor: "#f9f5fe" }}
            >
              <h2 className="font-semibold text-gray-900">Your Responses</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {summaryItems.map((item, i) => (
                <div key={i} className="px-6 py-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    {item.label}
                  </dt>
                  <dd className="text-gray-900">{item.value}</dd>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/results")}
              className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundColor: "#8A3BDB" }}
            >
              View Results
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-lg border-2 font-semibold text-base transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ borderColor: "#8A3BDB", color: "#8A3BDB" }}
            >
              Home
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
