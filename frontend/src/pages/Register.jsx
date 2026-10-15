import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signInWithGoogle } from "../services/firebase.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, loginWithFirebase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const idToken = await signInWithGoogle();
      await loginWithFirebase(idToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Firebase Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          className="block text-center text-xl font-extrabold tracking-tight mb-8"
        >
          Get<span className="text-accent-text">Fit</span>
        </Link>

        <div className="card p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-6">Start tracking your fitness journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="input"
              />
            </div>

            {error && <p className="text-sm text-brand">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-accent w-full">
              {submitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-line flex-1" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px bg-line flex-1" />
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="btn-outline w-full"
          >
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        <p className="text-sm text-muted text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-text font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;