"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "../components/Icon";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirectPath = searchParams.get("from") || "/dashboard";

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }

    document.cookie = "tourism_bd_auth=true; path=/; max-age=86400; SameSite=Lax";
    router.push(redirectPath.startsWith("/") ? redirectPath : "/dashboard");
  }

  return (
    <LoginShell
      email={email}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      password={password}
    />
  );
}

function LoginShell({
  email = "",
  error = "",
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="auth-page" id="main-content">
      <section className="auth-visual" aria-hidden="true">
        <a className="brand" href="/" tabIndex={-1}>
          <img className="brand-logo" src="/assets/logo.png" alt="" />
          <span>
            Tourism BD
            <small>Your safe journey partner</small>
          </span>
        </a>
        <blockquote>
          <p>Rivers, tea gardens, and a warm welcome — all in one journey.</p>
          <ul>
            <li><Icon name="check" size={16} /> Your itinerary and guide details</li>
            <li><Icon name="check" size={16} /> Support requests and safety checklist</li>
            <li><Icon name="check" size={16} /> Emergency contacts, one tap away</li>
          </ul>
        </blockquote>
      </section>

      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-card">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-title">Sign in to your dashboard</h1>
          <p>
            Access your itinerary, guide contacts, support requests, and travel
            documents from one secure place.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label>
              Email
              <span className="input-wrap">
                <Icon name="chat" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange?.(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
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
                  onChange={(event) => onPasswordChange?.(event.target.value)}
                  placeholder="Enter password"
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

            <button type="submit" className="submit-button">
              Login
              <Icon name="arrow" size={18} />
            </button>
          </form>

          <p className="auth-footer">
            New to Tourism BD? <a href="/#registration">Register your visit</a> ·{" "}
            <a href="/">Back to home</a>
          </p>
        </div>
      </section>
    </main>
  );
}
