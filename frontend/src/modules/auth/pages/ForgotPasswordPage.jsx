import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import api from "../../../services/apiClient";

/**
 * Simple forgot-password form (sends email OTP link).
 * Backend endpoint expected: POST /auth/forgot-password  { email }
 * If you don't have that endpoint yet, keep UI; backend implementation later.
 */
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleForgot = async (values) => {
    const { email } = values;
    if (!email) throw "Please enter your email";

    // call backend - if you don't have endpoint, this will fail; then show message accordingly
    await api.post("/auth/forgot-password", { email });

    setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      {!sent ? (
        <AuthForm
          title="Reset your password"
          fields={[{ name: "email", type: "email", placeholder: "Enter your registered email", label: "Email" }]}
          onSubmit={handleForgot}
          submitLabel="Send reset link"
          footer={<div className="text-xs text-gray-500">We'll send a verification link to your email.</div>}
        />
      ) : (
        <div className="max-w-md w-full mx-auto mt-12 bg-white p-6 rounded-lg shadow text-center">
          <h3 className="font-semibold text-lg">Check your email</h3>
          <p className="text-sm text-gray-600 mt-2">We sent a password reset link to your email. Follow it to reset your password.</p>
          <a href="/login" className="inline-block mt-4 text-sm underline">Back to login</a>
        </div>
      )}
    </div>
  );
}
