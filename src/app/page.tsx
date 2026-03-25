import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-background overflow-hidden">
      {/* Left Sidebar - Dynamic User Details */}
      <div className="hidden lg:block w-[400px] border-r border-border/50 h-screen fixed left-0 top-0">
        <UserSidebar />
      </div>

      {/* Right Panel - Scrollable Wishlist Items */}
      <main className="flex-1 lg:ml-[400px] h-screen overflow-y-auto">
        <WishlistPanel />
      </main>

      {/* Mobile Sidebar Overlay (if needed, but proposal specifies two-column split layout) */}
    </div>
  );
}