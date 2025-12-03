import LiveDataPreviews from "@/app/components/dashboard/LiveDataPreviews";
import HeroSection from "@/app/components/dashboard/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <HeroSection />
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <LiveDataPreviews />
        </div>
      </div>
    </div>
  );
}
