import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import api from "../../../services/apiClient";

/**
 * Modern Register Page with Premium UI/UX
 * Features: Glassmorphism, 4 Role Selection (Student/Alumni/Faculty/Admin), Smooth Animations
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values) => {
    const { name, email, password } = values;

    if (!name || !email || !password) throw "Please fill all required fields";

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registered successfully! Please login.");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // 4 Role Options with unique colors and icons
  const roleOptions = [
    { 
      value: "student", 
      label: "Student", 
      icon: "🎓", 
      color: "from-blue-500 to-cyan-500",
      description: "Current students"
    },
    { 
      value: "alumni", 
      label: "Alumni", 
      icon: "🏆", 
      color: "from-purple-500 to-pink-500",
      description: "Graduated students"
    },
    { 
      value: "faculty", 
      label: "Faculty", 
      icon: "👨‍🏫", 
      color: "from-orange-500 to-red-500",
      description: "Teaching staff"
    },
    { 
      value: "admin", 
      label: "Admin", 
      icon: "⚡", 
      color: "from-emerald-500 to-teal-500",
      description: "System administrators"
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -top-20 right-1/4 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Glass Card Container */}
      <div className="relative w-full max-w-2xl transform transition-all duration-700 ease-out opacity-0 translate-y-5 animate-fadeIn">
        <div className="backdrop-blur-2xl bg-white/90 rounded-3xl shadow-2xl p-10 border border-white/30 hover:shadow-3xl transition-shadow duration-300">
          
          {/* Logo/Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-3xl mb-5 shadow-xl transform hover:scale-110 hover:rotate-3 transition-all duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2 tracking-tight">
              Join BCET Connect
            </h1>
            <p className="text-gray-600 text-sm font-semibold">Create your account in seconds</p>
          </div>

          {/* Role Selection Cards - 4 Options */}
          <div className="mb-7">
            <label className="block text-base font-bold text-gray-800 mb-4 text-center">Select Your Role</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    role === option.value
                      ? 'border-transparent bg-gradient-to-br ' + option.color + ' text-white shadow-xl scale-105'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <div className="text-sm font-bold mb-1">{option.label}</div>
                  <div className={`text-xs ${role === option.value ? 'text-white/90' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                  
                  {/* Checkmark for selected role */}
                  {role === option.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Form */}
          <AuthForm
            fields={[
              { 
                name: "name", 
                type: "text", 
                placeholder: "John Doe", 
                label: "Full Name" 
              },
              { 
                name: "email", 
                type: "email", 
                placeholder: "your.email@bcet.edu", 
                label: "Email Address" 
              },
              { 
                name: "password", 
                type: "password", 
                placeholder: "Create a strong password", 
                label: "Password" 
              },
            ]}
            onSubmit={handleRegister}
            submitLabel={isLoading ? "Creating account..." : "Create Account"}
            footer={
              <div className="space-y-5 mt-6">
                {/* Terms */}
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="/terms" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">Privacy Policy</a>
                </p>

                {/* Divider */}
                <div className="relative py-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-600 font-semibold">Already have an account?</span>
                  </div>
                </div>

                {/* Login Link Button */}
                <a 
                  href="/login"
                  className="block w-full text-center py-3.5 px-4 rounded-xl border-2 border-cyan-300 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 font-bold hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  Sign in to your account
                </a>
              </div>
            }
          />
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-white/95 text-base font-bold drop-shadow-lg">
            🚀 Join 10,000+ Students, Alumni & Faculty
          </p>
          <div className="flex items-center justify-center gap-6 text-white/90 text-sm font-semibold">
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Instant
            </span>
            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted
            </span>
          </div>
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

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}