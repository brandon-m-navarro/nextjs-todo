import Link from "next/link";
import SimpleAnimation from "@/app/components/ui/animation";
import LiveDataPreviews from "@/app/components/dashboard/LiveDataPreviews";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section - Static */}
      <div className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-5xl font-bold text-gray-900 mb-6">
            {`You Didn't Need This. Neither Did I.`}
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            But here it is anyway. A simple, beautiful todo app built with
            Next.js and Tailwind CSS.
          </p>
          <div className="flex justify-center">
            <SimpleAnimation />
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/projects"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Features Preview - Static */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Stay Organized
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl text-black font-semibold mb-3">
                Project Management
              </h3>
              <p className="text-gray-600">
                Organize tasks into projects with custom colors and
                descriptions. Keep your work and personal life separate but
                accessible.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">
                Smart Tasks
              </h3>
              <p className="text-gray-600">
                Create tasks with due dates, priorities, and descriptions. Mark
                them as complete and watch your productivity soar.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">
                Beautiful UI
              </h3>
              <p className="text-gray-600">
                This is an objective statement. Enjoy a clean, modern interface
                that makes task management a pleasure rather than a chore.
              </p>
            </div>
          </div>

          {/* Live Data Preview - Client Component */}
          <LiveDataPreviews />
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Organized?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join at least one other user (me) who is already boosting their
            productivity with this todo app!
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold inline-block"
          >
            Start Your Journey Now
          </Link>
        </div>
      </div>
    </div>
  );
}
