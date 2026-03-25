import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-neutral-200">
      {/* Left Column: Dynamic Profile */}
      <div className="w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-neutral-200 md:sticky md:top-0 md:h-screen">
        <UserSidebar />
      </div>

      {/* Right Column: Wishlist */}
      <main className="flex-1 bg-white h-full min-h-screen no-scrollbar overflow-y-auto">
        <WishlistPanel />
      </main>
    </div>
  );
}
