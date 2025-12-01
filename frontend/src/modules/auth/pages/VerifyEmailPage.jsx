import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../services/apiClient";

/**
 * Verify email page — expects a token in query string: ?token=abcd
 * Calls backend endpoint POST /auth/verify-email { token }
 */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (!token) throw new Error("Missing token");

        await api.post("/auth/verify-email", { token });

        setStatus("success");

        setTimeout(() => navigate("/login"), 2500);
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow text-center">
        {status === "loading" && <p className="text-gray-600">Verifying your email…</p>}
        {status === "success" && (
          <>
            <h3 className="text-lg font-semibold">Email verified</h3>
            <p className="text-sm text-gray-600 mt-2">You will be redirected to login shortly.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h3 className="text-lg font-semibold text-red-600">Verification failed</h3>
            <p className="text-sm text-gray-600 mt-2">The verification link is invalid or expired.</p>
            <a href="/register" className="underline mt-3 inline-block">Register again</a>
          </>
        )}
      </div>
    </div>
  );
}
