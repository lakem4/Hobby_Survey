import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { SurveyFormData } from "../lib/types";

const ACCENT = "#8A3BDB";

const emptyForm: SurveyFormData = {
  gymFrequency: "",
  experienceRating: "",
  frustrations: [],
  frustrationsOther: "",
  gymTime: "",
  gymAnxiety: "",
  biggestChallenge: "",
  improvements: [],
};

type Errors = Partial<Record<keyof SurveyFormData, string>>;

function validate(data: SurveyFormData): Errors {
  const errors: Errors = {};
  if (!data.gymFrequency) errors.gymFrequency = "Please select an option.";
  if (!data.experienceRating) errors.experienceRating = "Please select an option.";
  if (data.frustrations.length === 0) errors.frustrations = "Please select at least one option.";
  if (data.frustrations.includes("other") && !data.frustrationsOther.trim())
    errors.frustrationsOther = "Please describe your other frustration.";
  if (!data.gymTime) errors.gymTime = "Please select an option.";
  if (!data.gymAnxiety) errors.gymAnxiety = "Please select an option.";
  if (!data.biggestChallenge.trim()) errors.biggestChallenge = "This field is required.";
  if (data.improvements.length === 0) errors.improvements = "Please select at least one option.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

function QuestionCard({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <fieldset className="bg-white rounded-xl border border-gray-200 p-6">
      <legend className="text-base font-semibold text-gray-900 mb-4 w-full">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

export default function Survey() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SurveyFormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleRadio(field: keyof SurveyFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleCheckbox(field: "frustrations" | "improvements", value: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [field]: updated };
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSelect(field: keyof SurveyFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleText(field: keyof SurveyFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrorKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase.from("survey_responses").insert([
        {
          gym_frequency: form.gymFrequency,
          experience_rating: form.experienceRating,
          frustrations: form.frustrations,
          frustrations_other: form.frustrationsOther || null,
          gym_time: form.gymTime,
          gym_anxiety: form.gymAnxiety,
          biggest_challenge: form.biggestChallenge,
          improvements: form.improvements,
        },
      ]);

      if (error) throw error;
      navigate("/confirmation", { state: form });
    } catch (err) {
      setSubmitError(
        "Something went wrong while submitting. Please try again."
      );
      setSubmitting(false);
    }
  }

  const selectStyle: React.CSSProperties = {
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "36px",
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:border-transparent";
  const radioCheckClass =
    "w-4 h-4 mt-0.5 shrink-0 focus:ring-2 cursor-pointer";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            Gym Experience Survey
          </h1>
          <a
            href="/results"
            className="text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 rounded"
            style={{ color: ACCENT }}
            onClick={(e) => {
              e.preventDefault();
              navigate("/results");
            }}
          >
            View Results
          </a>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-6">
            All questions are required. Your responses are anonymous.
          </p>

          {submitError && (
            <div
              role="alert"
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Q1 — Gym Frequency */}
            <div>
              <label
                htmlFor="field-gymFrequency"
                className="block text-base font-semibold text-gray-900 mb-2"
              >
                1. How often do you go to the gym?
              </label>
              <select
                id="field-gymFrequency"
                value={form.gymFrequency}
                onChange={(e) => handleSelect("gymFrequency", e.target.value)}
                aria-describedby={errors.gymFrequency ? "err-gymFrequency" : undefined}
                aria-invalid={!!errors.gymFrequency}
                className={`${inputClass} ${errors.gymFrequency ? "border-red-500 ring-red-300" : ""}`}
                style={selectStyle}
              >
                <option value="">Select frequency...</option>
                <option value="daily">Daily</option>
                <option value="4-6">4–6 times per week</option>
                <option value="2-3">2–3 times per week</option>
                <option value="once">Once a week</option>
                <option value="rarely">Rarely</option>
              </select>
              <FieldError id="err-gymFrequency" message={errors.gymFrequency} />
            </div>

            {/* Q2 — Experience Rating */}
            <QuestionCard label="2. How would you rate your gym experience?">
              <div
                role="group"
                aria-describedby={errors.experienceRating ? "err-experienceRating" : undefined}
                className="space-y-3"
              >
                {[
                  { value: "excellent", label: "Excellent" },
                  { value: "good", label: "Good" },
                  { value: "average", label: "Average" },
                  { value: "poor", label: "Poor" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="experienceRating"
                      value={opt.value}
                      checked={form.experienceRating === opt.value}
                      onChange={() => handleRadio("experienceRating", opt.value)}
                      className={radioCheckClass}
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="err-experienceRating" message={errors.experienceRating} />
            </QuestionCard>

            {/* Q3 — Frustrations */}
            <QuestionCard label="3. What frustrates you most at the gym? (select all that apply)">
              <div
                role="group"
                aria-describedby={errors.frustrations ? "err-frustrations" : undefined}
                className="space-y-3"
              >
                {[
                  { value: "crowded", label: "Too crowded" },
                  { value: "wait", label: "Long wait times for machines" },
                  { value: "intimidating", label: "Intimidating environment" },
                  { value: "guidance", label: "Lack of guidance/workout plan" },
                  { value: "dirty", label: "Dirty equipment" },
                  { value: "other", label: "Other" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={form.frustrations.includes(opt.value)}
                      onChange={() => handleCheckbox("frustrations", opt.value)}
                      className={radioCheckClass}
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="err-frustrations" message={errors.frustrations} />

              {form.frustrations.includes("other") && (
                <div className="mt-4">
                  <label
                    htmlFor="field-frustrationsOther"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Please describe your other frustration:
                  </label>
                  <input
                    id="field-frustrationsOther"
                    type="text"
                    value={form.frustrationsOther}
                    onChange={(e) => handleText("frustrationsOther", e.target.value)}
                    aria-describedby={errors.frustrationsOther ? "err-frustrationsOther" : undefined}
                    aria-invalid={!!errors.frustrationsOther}
                    placeholder="Describe your frustration..."
                    className={`${inputClass} ${errors.frustrationsOther ? "border-red-500" : ""}`}
                    style={{ focusRingColor: ACCENT } as React.CSSProperties}
                  />
                  <FieldError id="err-frustrationsOther" message={errors.frustrationsOther} />
                </div>
              )}
            </QuestionCard>

            {/* Q4 — Gym Time */}
            <div>
              <label
                htmlFor="field-gymTime"
                className="block text-base font-semibold text-gray-900 mb-2"
              >
                4. What time do you usually go to the gym?
              </label>
              <select
                id="field-gymTime"
                value={form.gymTime}
                onChange={(e) => handleSelect("gymTime", e.target.value)}
                aria-describedby={errors.gymTime ? "err-gymTime" : undefined}
                aria-invalid={!!errors.gymTime}
                className={`${inputClass} ${errors.gymTime ? "border-red-500" : ""}`}
                style={selectStyle}
              >
                <option value="">Select time...</option>
                <option value="early_morning">Early morning (5–8 AM)</option>
                <option value="late_morning">Late morning (8–11 AM)</option>
                <option value="afternoon">Afternoon (12–4 PM)</option>
                <option value="evening">Evening (5–8 PM)</option>
                <option value="night">Night (8 PM+)</option>
              </select>
              <FieldError id="err-gymTime" message={errors.gymTime} />
            </div>

            {/* Q5 — Gym Anxiety */}
            <QuestionCard label="5. Do you feel anxious at the gym?">
              <div
                role="group"
                aria-describedby={errors.gymAnxiety ? "err-gymAnxiety" : undefined}
                className="space-y-3"
              >
                {[
                  { value: "yes_often", label: "Yes, often" },
                  { value: "sometimes", label: "Sometimes" },
                  { value: "rarely", label: "Rarely" },
                  { value: "never", label: "Never" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gymAnxiety"
                      value={opt.value}
                      checked={form.gymAnxiety === opt.value}
                      onChange={() => handleRadio("gymAnxiety", opt.value)}
                      className={radioCheckClass}
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="err-gymAnxiety" message={errors.gymAnxiety} />
            </QuestionCard>

            {/* Q6 — Biggest Challenge */}
            <div>
              <label
                htmlFor="field-biggestChallenge"
                className="block text-base font-semibold text-gray-900 mb-2"
              >
                6. What is your biggest challenge at the gym?
              </label>
              <input
                id="field-biggestChallenge"
                type="text"
                value={form.biggestChallenge}
                onChange={(e) => handleText("biggestChallenge", e.target.value)}
                aria-describedby={errors.biggestChallenge ? "err-biggestChallenge" : undefined}
                aria-invalid={!!errors.biggestChallenge}
                placeholder="Describe your biggest challenge..."
                className={`${inputClass} ${errors.biggestChallenge ? "border-red-500" : ""}`}
              />
              <FieldError id="err-biggestChallenge" message={errors.biggestChallenge} />
            </div>

            {/* Q7 — Improvements */}
            <QuestionCard label="7. What would improve your gym experience? (select all that apply)">
              <div
                role="group"
                aria-describedby={errors.improvements ? "err-improvements" : undefined}
                className="space-y-3"
              >
                {[
                  { value: "less_crowded", label: "Less crowded environment" },
                  { value: "structured", label: "Structured workouts provided" },
                  { value: "smaller_groups", label: "Smaller group settings" },
                  { value: "better_equipment", label: "Better equipment availability" },
                  { value: "beginner_friendly", label: "More beginner-friendly atmosphere" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={form.improvements.includes(opt.value)}
                      onChange={() => handleCheckbox("improvements", opt.value)}
                      className={radioCheckClass}
                      style={{ accentColor: ACCENT }}
                    />
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="err-improvements" message={errors.improvements} />
            </QuestionCard>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-10 py-3 rounded-lg text-white font-semibold text-base transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60"
                style={{ backgroundColor: ACCENT }}
              >
                {submitting ? "Submitting..." : "Submit Survey"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
