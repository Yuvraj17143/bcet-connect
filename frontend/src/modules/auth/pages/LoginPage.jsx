import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../../../context/AuthContext";

/**
 * Modern Login Page with Premium UI/UX
 * Features: Glassmorphism, Smooth Animations, Gradient Backgrounds
 */
export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;

    if (!email || !password) throw "Please enter email & password";

    setIsLoading(true);
    try {
      await login(email, password);
      
      const finalRole = (localStorage.getItem("userRole") || user?.role || "").toLowerCase();

      if (finalRole === "admin") navigate("/admin");
      else if (finalRole === "faculty") navigate("/faculty");
      else if (finalRole === "alumni") navigate("/feed");
      else navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Glass Card Container */}
      <div className="relative w-full max-w-md transform transition-all duration-700 ease-out opacity-0 translate-y-5 animate-fadeIn">
        <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl p-10 border border-white/30 hover:shadow-3xl transition-shadow duration-300">
          
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl mb-5 shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm font-semibold">Sign in to BCET Connect</p>
          </div>

          {/* Auth Form */}
          <AuthForm
            fields={[
              { 
                name: "email", 
                type: "email", 
                placeholder: "your.email@bcet.edu", 
                label: "Email Address" 
              },
              { 
                name: "password", 
                type: "password", 
                placeholder: "••••••••", 
                label: "Password" 
              },
            ]}
            onSubmit={handleLogin}
            submitLabel={isLoading ? "Signing in..." : "Sign In"}
            footer={
              <div className="space-y-5 mt-6">
                {/* Forgot Password Link */}
                <div className="flex items-center justify-end text-sm">
                  <a 
                    href="/forgot-password" 
                    className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                
                {/* Divider */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-600 font-semibold">New to BCET?</span>
                  </div>
                </div>

                {/* Register Link Button */}
                <a 
                  href="/register"
                  className="block w-full text-center py-3.5 px-4 rounded-xl border-2 border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 font-bold hover:from-violet-100 hover:to-purple-100 hover:border-violet-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  Create an account
                </a>
              </div>
            }
          />
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-8 text-center">
          <p className="text-white/95 text-sm font-bold drop-shadow-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure Login • Powered by BCET Connect
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}