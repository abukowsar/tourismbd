"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Icon from "../../components/Icon";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter your admin username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Could not sign in.");
      }

      const from = searchParams.get("from") || "/admin";
      window.location.href = from.startsWith("/admin") && from !== "/admin/login" ? from : "/admin";
    } catch (loginError) {
      setError(loginError.message);
      setLoading(false);
    }
  }

  return (
    <main className="admin-login" id="main-content">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <a className="admin-brand dark" href="/">
          <img src="/assets/logo.png" alt="" aria-hidden="true" />
          <span>
            Tourism BD
            <small>Management console</small>
          </span>
        </a>

        <h1 id="admin-login-title">Staff sign in</h1>
        <p>Manage visitors, tour guides, support requests, travel alerts, and Tourist Police records.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Username
            <span className="input-wrap">
              <Icon name="passport" size={18} />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoFocus
              />
            </span>
          </label>
          <label>
            Password
            <span className="input-wrap">
              <Icon name="shield" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {error ? (
            <p className="auth-error" role="alert">
              <Icon name="info" size={18} />
              {error}
            </p>
          ) : null}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
            {!loading ? <Icon name="arrow" size={18} /> : null}
          </button>
        </form>

        <p className="auth-footer">
          <Icon name="shield" size={14} /> Sessions expire after 8 hours. Not staff?{" "}
          <a href="/login">Traveler login</a>
        </p>
      </section>
    </main>
  );
}
