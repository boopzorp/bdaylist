"use client";

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';

export default function Home() {
  const [theme, setTheme] = useState('theme-noir');

  useEffect(() => {
    const savedTheme = localStorage.getItem('wishstream_theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('wishstream_theme', newTheme);
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-background transition-colors duration-500 ${theme}`}>
      {/* Left Column: Dynamic Profile */}
      <div className="w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-border md:sticky md:top-0 md:h-screen">
        <UserSidebar currentTheme={theme} onThemeChange={handleThemeChange} />
      </div>

      {/* Right Column: Wishlist */}
      <main className="flex-1 bg-card h-full min-h-screen no-scrollbar overflow-y-auto">
        <WishlistPanel />
      </main>
    </div>
  );
}
