"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to <strong className="underline decoration-sky-500">todo.bnav.dev!</strong>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A minimal todo application demonstrating integration with my SSO
          ecosystem, implemented using Next.js, Prisma, and TailwindCSS.
        </p>

        {/* Connected Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-0">
          <div className="relative flex flex-col sm:flex-row items-stretch rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 bg-white">
            {/* Primary Button */}
            <button
              onClick={async () => {
                window.location.href = "/api/auth/sso/login";
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

            {/* Divider - Visible on desktop */}
            <div className="hidden sm:flex items-center justify-center">
              <div className="w-px h-8 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300"></div>
            </div>

            {/* Divider with "or" - Visible on mobile */}
            <div className="sm:hidden flex items-center justify-center my-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">
                    or
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <Link
              href="/projects"
              className="px-10 py-4 bg-white text-gray-800 font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <svg
                className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              <span>Browse as Guest</span>
            </Link>
          </div>
        </div>

        {/* Helper text */}
        <p className="mt-6 text-gray-500 text-sm max-w-md mx-auto">
          Both options give you access to all features. Logging in allows your
          projects to be private.
        </p>
      </div>
    </div>
  );
}
