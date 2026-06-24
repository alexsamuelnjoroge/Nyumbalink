import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import SearchHero from '@/components/home/SearchHero';
import AreaChips from '@/components/home/AreaChips';
import UnitTypeSelector from '@/components/home/UnitTypeSelector';
import FeaturedAreas from '@/components/home/FeaturedAreas';
import HowItWorks from '@/components/home/HowItWorks';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0">
        {/* Hero with search */}
        <SearchHero />

        {/* Quick filters */}
        <div className="bg-[#F7F9FC]">
          <AreaChips />
          <UnitTypeSelector />
        </div>

        {/* Divider */}
        <div className="h-2 bg-[#E2E8F0]" />

        {/* Featured areas */}
        <FeaturedAreas />

        {/* Divider */}
        <div className="h-2 bg-[#E2E8F0]" />

        {/* How it works + trust numbers */}
        <HowItWorks />
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}
