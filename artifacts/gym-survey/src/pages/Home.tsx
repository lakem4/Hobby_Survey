import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
              style={{ backgroundColor: "#8A3BDB" }}
            >
              Quick Survey
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gym Experience Survey
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Help us understand your gym habits, frustrations, and overall
            experience. This short survey takes about 2 minutes to complete.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/survey")}
              className="px-8 py-3 rounded-lg text-white font-semibold text-base transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ backgroundColor: "#8A3BDB", "--tw-ring-color": "#8A3BDB" } as React.CSSProperties}
            >
              Take the Survey
            </button>
            <button
              onClick={() => navigate("/results")}
              className="px-8 py-3 rounded-lg border-2 font-semibold text-base transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ borderColor: "#8A3BDB", color: "#8A3BDB" }}
            >
              View Results
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
