import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/auth/register", {
        full_name: fullName,
        email,
        password,
      });

      setMessage("Account created successfully. You can login now.");
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data);

      const errorMessage =
        err.response?.data?.detail || "Registration failed";

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-950 to-blue-900"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4">
            N
          </div>

          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-300 mt-2">Start using Nexa ERP</p>
        </div>

        {message && (
          <div className="mb-4 bg-green-500/20 text-green-200 px-4 py-3 rounded-xl text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-slate-300 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-300 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;