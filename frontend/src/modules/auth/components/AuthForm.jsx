import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Generic AuthForm component (modern look)
 *
 * Props:
 *  - title: string
 *  - fields: [{ name, type, placeholder, label, optional }]
 *  - onSubmit: async function(values) -> should handle API
 *  - submitLabel: string (default: title)
 *  - footer?: React node (optional small footer links)
 */
export default function AuthForm({
  title,
  fields = [],
  onSubmit,
  submitLabel,
  footer,
}) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // initialize default values if fields change
    const init = {};
    fields.forEach((f) => {
      init[f.name] = f.default || "";
    });
    setValues(init);
  }, [fields]);

  const handleChange = (e) => {
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      // expect err as string or object with message/fields
      if (!err) {
        setErrors({ form: "Something went wrong" });
      } else if (typeof err === "string") {
        setErrors({ form: err });
      } else if (err?.response?.data?.message) {
        setErrors({ form: err.response.data.message });
      } else {
        setErrors({ form: err.message || "Request failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-12">
      <div className="bg-white/80 backdrop-blur px-6 py-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">{title}</h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Welcome to BCET Connect — your campus & alumni hub
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {errors.form && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{errors.form}</div>
          )}

          {fields.map((field) => {
            const isPassword = field.type === "password";
            return (
              <div key={field.name}>
                {field.label && (
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                )}

                <div className="relative">
                  <input
                    name={field.name}
                    type={isPassword ? (showPassword ? "text" : "password") : field.type}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    required={!field.optional}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  />

                  {isPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-2.5 text-gray-500"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>

                {errors[field.name] && (
                  <p className="text-xs text-red-600 mt-1">{errors[field.name]}</p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg font-medium transition"
          >
            {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>}
            <span>{submitLabel || title}</span>
          </button>
        </form>

        {footer && <div className="mt-4 text-center text-sm text-gray-500">{footer}</div>}
      </div>

      <p className="text-xs text-center text-gray-400 mt-3">
        By continuing you agree with BCET Connect <span className="underline">Terms</span>
      </p>
    </div>
  );
}
