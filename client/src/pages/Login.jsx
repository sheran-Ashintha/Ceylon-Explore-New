import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getAuthCopy } from "../utils/authTranslations";
import { SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./Auth.css";

function Login() {
  const { language, setLanguage } = useSiteLanguage();
  const copy = getAuthCopy(language);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const googleButtonRef = useRef(null);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleCredential = useEffectEvent(async (credential) => {
    if (!credential) {
      setError(copy.login.errors.failed);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await loginWithGoogle(credential);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || copy.login.errors.failed);
    } finally {
      setSubmitting(false);
    }
  });

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return undefined;
    }

    let active = true;
    let script;

    const renderGoogleButton = () => {
      if (!active || !window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      const width = Math.max(220, Math.floor(googleButtonRef.current.offsetWidth || 320));
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => handleGoogleCredential(response.credential),
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width,
      });
    };

    const handleScriptError = () => {
      if (active) {
        setError(copy.login.errors.failed);
      }
    };

    script = document.querySelector('script[data-google-identity="true"]');

    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else if (script) {
      script.addEventListener("load", renderGoogleButton);
      script.addEventListener("error", handleScriptError);
    } else {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      script.addEventListener("load", renderGoogleButton);
      script.addEventListener("error", handleScriptError);
      document.head.appendChild(script);
    }

    return () => {
      active = false;
      if (script) {
        script.removeEventListener("load", renderGoogleButton);
        script.removeEventListener("error", handleScriptError);
      }
    };
  }, [googleClientId, copy.login.errors.failed, handleGoogleCredential]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError(copy.login.errors.fillAll);
      return;
    }
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || copy.login.errors.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-topbar">
          <div className="auth-lang">
            <span className="auth-lang-label">{copy.selectLanguage}</span>
            <select aria-label={copy.selectLanguage} value={language} onChange={(event) => setLanguage(event.target.value)}>
              {SITE_LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="auth-brand">
          <Link to="/" className="logo">Ceylon Explore</Link>
          <h2>{copy.login.title}</h2>
          <p>{copy.login.subtitle}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{copy.common.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder={copy.common.emailPlaceholder}
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{copy.common.password}</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder={copy.common.passwordPlaceholder}
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                aria-label={showPassword ? copy.common.hidePassword : copy.common.showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  // Password is visible: show open eye
                  <svg
                    className="eye-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5C6 5 2 11 2 11s4 6 10 6 10-6 10-6-4-6-10-6zm0 2c3.038 0 5.642 2.164 6.912 4C17.642 12.836 15.038 15 12 15s-5.642-2.164-6.912-4C6.358 9.164 8.962 7 12 7zm0 1.5A2.5 2.5 0 1 0 14.5 11 2.503 2.503 0 0 0 12 8.5z"
                      fill="currentColor"
                    />
                  </svg>
                ) : (
                  // Password is hidden: show crossed-out eye
                  <svg
                    className="eye-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3.707 4.414 2.293l18 18L21 22.707l-2.49-2.49A11.706 11.706 0 0 1 12 21C6 21 2 15 2 15s1.273-1.877 3.318-3.71L3 9.973V9s2.5-3 9-3c1.72 0 3.22.24 4.535.63L3 3.707zm9 4.293a4 4 0 0 0-4 4v.086l1.67 1.67A2.5 2.5 0 0 1 12 11.5a2.48 2.48 0 0 1 1.068.244l1.62 1.62A4 4 0 0 0 12 8z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label>
              <input type="checkbox" /> {copy.common.rememberMe}
            </label>
            <a href="#">{copy.common.forgotPassword}</a>
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? copy.login.submitting : copy.login.submit}
          </button>

          {googleClientId ? (
            <>
              <div className="auth-divider"><span>{copy.common.continueWith}</span></div>

              <div className="social-buttons">
                <div className={`google-auth-slot${submitting ? " is-busy" : ""}`}>
                  <div ref={googleButtonRef} className="google-auth-button" />
                </div>
              </div>
            </>
          ) : null}
        </form>

        <div className="auth-footer">
          {copy.login.footerLead} <Link to="/register">{copy.login.footerAction}</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
