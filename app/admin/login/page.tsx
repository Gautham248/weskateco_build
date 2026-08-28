import { loginAction } from "lib/admin/actions/auth";
import "../admin.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "invalid";

  return (
    <div className="admin-login-root">
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">W</div>
          <div className="admin-login-logo-text">
            <h1>WeSkate Co</h1>
            <p>Admin Panel</p>
          </div>
        </div>

        {/* Error */}
        {hasError && (
          <div className="admin-error-msg">
            Invalid username or password. Please try again.
          </div>
        )}

        {/* Form */}
        <form action={loginAction}>
          <div className="admin-form-field">
            <label className="admin-form-label" htmlFor="admin-username">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="admin"
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-field">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="admin-form-input"
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", marginTop: "8px", justifyContent: "center", padding: "12px" }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                clipRule="evenodd"
              />
            </svg>
            Sign In
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            fontSize: "11px",
            color: "var(--admin-text-subtle)",
            textAlign: "center",
          }}
        >
          Secured session · 8-hour expiry
        </p>
      </div>
    </div>
  );
}
