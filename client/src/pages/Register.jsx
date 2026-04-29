import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getAuthCopy } from "../utils/authTranslations";
import { SITE_LANGUAGE_OPTIONS, useSiteLanguage } from "../utils/siteLanguage";
import "./Auth.css";

function Register() {
  const { language, setLanguage } = useSiteLanguage();
  const copy = getAuthCopy(language);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError(copy.register.errors.fillAll);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(copy.register.errors.passwordMismatch);
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || copy.register.errors.failed);
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
          <h2>{copy.register.title}</h2>
          <p>{copy.register.subtitle}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{copy.common.fullName}</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder={copy.common.namePlaceholder}
              value={form.name}
              onChange={handleChange}
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">{copy.common.confirmPassword}</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder={copy.common.passwordPlaceholder}
                value={form.confirmPassword}
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

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? copy.register.submitting : copy.register.submit}
          </button>

          <div className="auth-divider"><span>{copy.common.signUpWith}</span></div>

          <div className="social-buttons">
            <button type="button" className="social-btn">🔵 {copy.common.google}</button>
          </div>
        </form>

        <div className="auth-footer">
          {copy.register.footerLead} <Link to="/login">{copy.register.footerAction}</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
