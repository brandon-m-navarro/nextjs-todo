"use client";
import LiveDataPreviews from "@/app/components/dashboard/LiveDataPreviews";
import HeroSection from "@/app/components/dashboard/HeroSection";
import { useUserContext } from "./contexts/UserContext";

export default function HomePage() {
  const { isLoggedIn } = useUserContext();

  return (
    <div className="min-h-screen ">
      {isLoggedIn ? (
        <div className="bg-white">
          <div className="max-w-6xl mx-auto">
            <LiveDataPreviews />
          </div>
         </div>
      ) : (
        <div className="mt-[36px]">
          <HeroSection />
          <div className="bg-white mt-[36px]">
            <div className="max-w-6xl mx-auto">
              <LiveDataPreviews />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
