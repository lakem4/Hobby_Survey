import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import type { SurveyResponse, ResultsData, SupabaseSurveyRow } from "../lib/types";

const ACCENT = "#8A3BDB";
const COLORS = ["#8A3BDB", "#a855f7", "#c084fc", "#d8b4fe", "#ede9fe"];

const FREQUENCY_ORDER = ["daily", "4-6", "2-3", "once", "rarely"];
const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  "4-6": "4–6×/wk",
  "2-3": "2–3×/wk",
  once: "Once/wk",
  rarely: "Rarely",
};

const FRUSTRATION_LABELS: Record<string, string> = {
  crowded: "Too crowded",
  wait: "Long wait times",
  intimidating: "Intimidating env.",
  guidance: "Lack of guidance",
  dirty: "Dirty equipment",
  other: "Other",
};

const ANXIETY_ORDER = ["yes_often", "sometimes", "rarely", "never"];
const ANXIETY_LABELS: Record<string, string> = {
  yes_often: "Yes, often",
  sometimes: "Sometimes",
  rarely: "Rarely",
  never: "Never",
};

const TIME_ORDER = ["early_morning", "late_morning", "afternoon", "evening", "night"];
const TIME_LABELS: Record<string, string> = {
  early_morning: "5–8 AM",
  late_morning: "8–11 AM",
  afternoon: "12–4 PM",
  evening: "5–8 PM",
  night: "8 PM+",
};

function processResults(rows: SurveyResponse[]): ResultsData {
  const freqCount: Record<string, number> = {};
  const frustCount: Record<string, number> = {};
  const anxietyCount: Record<string, number> = {};
  const timeCount: Record<string, number> = {};

  for (const row of rows) {
    freqCount[row.gymFrequency] = (freqCount[row.gymFrequency] ?? 0) + 1;
    anxietyCount[row.gymAnxiety] = (anxietyCount[row.gymAnxiety] ?? 0) + 1;
    timeCount[row.gymTime] = (timeCount[row.gymTime] ?? 0) + 1;
    for (const f of row.frustrations) {
      frustCount[f] = (frustCount[f] ?? 0) + 1;
    }
  }

  return {
    total: rows.length,
    frequencyData: FREQUENCY_ORDER.filter((k) => freqCount[k]).map((k) => ({
      name: FREQUENCY_LABELS[k],
      count: freqCount[k],
    })),
    frustrationData: Object.entries(frustCount)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({ name: FRUSTRATION_LABELS[k] ?? k, count: v })),
    anxietyData: ANXIETY_ORDER.filter((k) => anxietyCount[k]).map((k) => ({
      name: ANXIETY_LABELS[k],
      count: anxietyCount[k],
    })),
    timeData: TIME_ORDER.filter((k) => timeCount[k]).map((k) => ({
      name: TIME_LABELS[k],
      count: timeCount[k],
    })),
  };
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data: rows, error: err } = await supabase
          .from("survey_responses")
          .select(
            "gym_frequency, experience_rating, frustrations, gym_time, gym_anxiety, biggest_challenge, improvements"
          );

        if (err) throw err;

        const normalized = (rows as SupabaseSurveyRow[] ?? []).map((r) => ({
          gymFrequency: r.gym_frequency,
          experienceRating: r.experience_rating,
          frustrations: r.frustrations,
          frustrationsOther: "",
          gymTime: r.gym_time,
          gymAnxiety: r.gym_anxiety,
          biggestChallenge: r.biggest_challenge,
          improvements: r.improvements,
        }));

        setData(processResults(normalized as SurveyResponse[]));
      } catch {
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Survey Results</h1>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 rounded"
            style={{ color: ACCENT }}
          >
            ← Home
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="text-center py-20 text-gray-500">
              Loading results...
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              {/* Total responses banner */}
              <div
                className="rounded-xl p-6 mb-8 text-white text-center"
                style={{ backgroundColor: ACCENT }}
              >
                <p className="text-sm font-medium uppercase tracking-wide opacity-80 mb-1">
                  Total Responses
                </p>
                <p className="text-5xl font-bold">{data.total}</p>
              </div>

              {data.total === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No responses yet.</p>
                  <button
                    onClick={() => navigate("/survey")}
                    className="mt-4 px-6 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Be the first to respond
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Gym Frequency */}
                  <ChartCard title="Gym Frequency Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={data.frequencyData}
                        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f3ebfd" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Bar dataKey="count" name="Responses" fill={ACCENT} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Gym Anxiety */}
                  <ChartCard title="Gym Anxiety Levels">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={data.anxietyData}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          labelLine={false}
                        >
                          {data.anxietyData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Top Frustrations */}
                  <ChartCard title="Top Gym Frustrations">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart
                        data={data.frustrationData}
                        layout="vertical"
                        margin={{ top: 4, right: 8, left: 4, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis
                          type="number"
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          width={120}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f3ebfd" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Bar dataKey="count" name="Responses" fill={ACCENT} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>

                  {/* Preferred Times */}
                  <ChartCard title="Preferred Gym Times">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={data.timeData}
                        margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f3ebfd" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          name="Responses"
                          fill={ACCENT}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartCard>
                </div>
              )}

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => navigate("/survey")}
                  className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: ACCENT }}
                >
                  Take the Survey
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 rounded-lg border-2 font-semibold text-base transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ borderColor: ACCENT, color: ACCENT }}
                >
                  Home
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
