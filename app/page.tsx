// app/page.tsx
import Link from 'next/link';
import SimpleAnimation from '@/app/components/ui/animation';
import LiveDataPreviews from '@/app/components/dashboard/LiveDataPreviews';

// Remove dynamic/revalidate exports - page becomes static
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
            But here it is anyway. A simple, beautiful todo app built with Next.js and Tailwind CSS.
          </p>
          <div className="flex justify-center">
            <SimpleAnimation />
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors text-lg font-semibold"
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
            {/* Your static feature cards... */}
          </div>

          {/* Live Data Preview - Client Component */}
          <LiveDataPreviews />
        </div>
      </div>

      {/* CTA Section - Static */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        {/* Your static CTA... */}
      </div>
    </div>
  );
}
