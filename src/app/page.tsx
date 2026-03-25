
"use client";

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';
import { cn } from '@/lib/utils';

export default function Home() {
  const [theme, setTheme] = useState('theme-noir');
  const [isAdmin, setIsAdmin] = useState(true);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('wishstream_theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('wishstream_theme', newTheme);
  };

  const handleToggleProfile = (collapsed: boolean) => {
    setIsProfileCollapsed(collapsed);
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-background transition-colors duration-500 ${theme}`}>
      {/* Sidebar: Profile & Controls */}
      <div className={cn(
        "w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-border md:sticky md:top-0 md:h-screen shrink-0 transition-all duration-500",
        isProfileCollapsed ? "hidden md:block" : "block"
      )}>
        <UserSidebar 
          currentTheme={theme} 
          onThemeChange={handleThemeChange} 
          isAdmin={isAdmin} 
          onAdminToggle={() => setIsAdmin(!isAdmin)}
        />
      </div>

      {/* Main Content: Wishlist */}
      <main className="flex-1 bg-card min-h-screen">
        <WishlistPanel 
          isAdmin={isAdmin} 
          isProfileCollapsed={isProfileCollapsed}
          onToggleProfile={handleToggleProfile}
        />
      </main>
    </div>
  );
}
