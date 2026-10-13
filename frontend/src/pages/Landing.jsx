import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const FEATURES = [
  {
    title: "Consistency tracker",
    text: "A GitHub-style heatmap that shows how regular you've been over the year.",
  },
  {
    title: "Calendar view",
    text: "Pick any date and see what you logged that day.",
  },
  {
    title: "Progress overview",
    text: "Daily, weekly, monthly and yearly charts of your fitness journey.",
  },
  {
    title: "AI diet plans",
    text: "Get a diet plan based on your body type, goal and food preference.",
  },
];

const Landing = () => {
  const { user } = useAuth();

  // already logged in? skip the landing page
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Fitness Tracker</h1>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm rounded-lg bg-primary-600 text-white px-3 py-1.5 hover:bg-primary-700"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="px-4 sm:px-6 max-w-4xl mx-auto">
        <section className="py-12 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Build a fitness habit that sticks
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Log your workouts, see your consistency, and get a diet plan that
            matches your body and food choices.
          </p>
          <Link
            to="/register"
            className="inline-block rounded-lg bg-primary-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-700"
          >
            Get started
          </Link>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-16">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <h3 className="font-medium mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Landing;