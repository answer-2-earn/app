import { LandingCover } from "@/components/landing/landing-cover";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";

export default function LandingPage() {
  return (
    <main className="relative flex flex-col min-h-screen">
      <LandingHeader />
      <div className="flex-1">
        <LandingCover />
      </div>
      <LandingFooter />
    </main>
  );
}
