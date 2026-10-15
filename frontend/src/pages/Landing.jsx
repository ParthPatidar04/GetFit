import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const FEATURES = [
  {
    title: "Consistency tracker",
    text: "A GitHub-style heatmap that shows how regular you've been all year.",
  },
  {
    title: "Calendar view",
    text: "Pick any date and see what you logged that day.",
  },
  {
    title: "Progress overview",
    text: "Daily, weekly, monthly and yearly charts of your journey.",
  },
  {
    title: "AI diet assistant",
    text: "A diet plan for your body, goal and food choice, plus a chat for follow-up questions.",
  },
];

const Landing = () => {
  const { user } = useAuth();
  const [imgOk, setImgOk] = useState(true);

  // already logged in? skip the landing page
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-bg">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-5">
        <Link to="/" className="text-xl font-extrabold tracking-tight">
          Get<span className="text-accent-text">Fit</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-outline !py-2">
            Log in
          </Link>
          <Link to="/register" className="btn-accent !py-2">
            Sign up
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <section className="grid md:grid-cols-2 gap-10 items-center py-10 md:py-20">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Transform Your Body,{" "}
              <span className="text-accent-text">Transform Your Life</span>
            </h1>
            <p className="mt-5 text-muted max-w-md">
              Log your workouts, watch your consistency grow, and get a diet plan
              that matches your body and food choices.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-4 rounded-full bg-accent text-accent-fg pl-7 pr-2 py-2 font-semibold"
            >
              Get Started
              <span className="grid place-items-center w-11 h-11 rounded-full bg-black text-accent text-lg">
                →
              </span>
            </Link>
          </div>

          {/* ring + optional hero image (put your image at public/images/hero.jpg) */}
          <div className="relative mx-auto w-full max-w-sm aspect-square">
            <div className="absolute inset-0 rounded-full border-[20px] border-accent" />
            <div className="absolute inset-[20px] rounded-full overflow-hidden bg-surface2 grid place-items-center">
              {imgOk ? (
                <img
                  src="/images/hero.jpg"
                  alt=""
                  onError={() => setImgOk(false)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-extrabold text-accent-text text-center leading-tight px-6">
                  Move.
                  <br />
                  Eat.
                  <br />
                  Repeat.
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-16">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card p-5">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-accent text-accent-fg text-sm font-bold mb-4">
                {i + 1}
              </span>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted">{f.text}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        GetFit · Your fitness, your health
      </footer>
    </div>
  );
};

export default Landing;