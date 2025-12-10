"use client";
import { useUserContext } from "@/app/contexts/UserContext";

export default function HeroSection() {
  const { login } = useUserContext();

  const handleLogin = async () => {
    login();
  };

  return (
    <div className="text-center py-16 px-4 bg-gray-50 rounded-xl max-w-6xl m-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to{" "}
          <strong className="underline decoration-sky-500">
            todo.bnav.dev!
          </strong>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A minimal todo application demonstrating integration with my SSO
          ecosystem, implemented using Next.js, Prisma, and TailwindCSS. Created
          by a person, not AI.
        </p>

        {/* Connected Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-0">
          <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 bg-white">
            {/* Primary Button */}
            <button
              onClick={async () => {
                await handleLogin();
              }}
              className="px-10 py-4 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group sm:border-r sm:border-blue-500/30"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
              <span>Login</span>
            </button>
          </div>
        </div>

        {/* Helper text */}
        <p className="mt-6 text-gray-500 text-sm max-w-md mx-auto">
          Feel free to use the app without logging in! Logging in will enable you to create private projects only you can view/edit.
        </p>
      </div>
    </div>
  );
}
