
"use client";

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';
import LandingPage from '@/components/LandingPage';
import { cn } from '@/lib/utils';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [theme, setTheme] = useState('theme-noir');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [isFriendMode, setIsFriendMode] = useState(false);

  useEffect(() => {
    // Check for shared wishlist in URL
    const params = new URLSearchParams(window.location.search);
    const sharedUid = params.get('u');
    
    if (sharedUid) {
      setTargetUserId(sharedUid);
      setIsFriendMode(true);
      fetchTargetUserTheme(sharedUid);
    } else if (user) {
      setTargetUserId(user.uid);
      setIsFriendMode(false);
      const savedTheme = localStorage.getItem('wishstream_theme');
      if (savedTheme) setTheme(savedTheme);
    }
  }, [user]);

  const fetchTargetUserTheme = async (uid: string) => {
    if (!firestore) return;
    try {
      const profileDoc = await getDoc(doc(firestore, 'userProfiles', uid));
      if (profileDoc.exists() && profileDoc.data().theme) {
        setTheme(profileDoc.data().theme);
      }
    } catch (e) {
      console.error("Error fetching target user theme:", e);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('wishstream_theme', newTheme);
  };

  const handleToggleProfile = (collapsed: boolean) => {
    setIsProfileCollapsed(collapsed);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Show landing page if not logged in and no shared user ID in URL
  if (!user && !targetUserId) {
    return <LandingPage />;
  }

  return (
    <div className={cn("flex flex-col md:flex-row min-h-screen bg-background transition-colors duration-500", theme)}>
      {/* Sidebar: Profile & Controls */}
      <div className={cn(
        "w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-border md:sticky md:top-0 md:h-screen shrink-0 transition-all duration-500",
        isProfileCollapsed ? "hidden md:block" : "block"
      )}>
        <UserSidebar 
          currentTheme={theme} 
          onThemeChange={handleThemeChange} 
          isAdmin={!isFriendMode} 
          targetUserId={targetUserId}
        />
      </div>

      {/* Main Content: Wishlist */}
      <main className="flex-1 bg-card min-h-screen">
        <WishlistPanel 
          isAdmin={!isFriendMode} 
          targetUserId={targetUserId}
          isProfileCollapsed={isProfileCollapsed}
          onToggleProfile={handleToggleProfile}
        />
      </main>
    </div>
  );
}
