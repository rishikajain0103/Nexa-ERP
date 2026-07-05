import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("drishi@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("nexa_token", res.data.access_token);
      localStorage.setItem("nexa_user", JSON.stringify(res.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);

      const message =
        err.response?.data?.detail || "Invalid email or password";

      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-950 to-slate-900"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4">
            N
          </div>
          <h1 className="text-3xl font-bold text-white">Nexa ERP</h1>
          <p className="text-slate-300 mt-2">
            Billing • Inventory • Accounting
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-200 mb-2">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
            Login to Dashboard
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          Keyboard-first business management platform
        </p>

        <p className="text-center text-slate-300 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-300 font-semibold">
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;