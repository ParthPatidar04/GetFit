import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { signInWithGoogle } from "../services/firebase.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithFirebase } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const idToken = await signInWithGoogle();
      await loginWithFirebase(idToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Firebase Google sign-in error:", err);
      setError(`Google sign-in failed: ${err.code || err.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Log in to continue your fitness journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary-600 text-white py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2 text-sm font-medium disabled:opacity-60"
        >
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;