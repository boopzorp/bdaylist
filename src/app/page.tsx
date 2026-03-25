"use client";

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';
import LandingPage from '@/components/LandingPage';
import { cn } from '@/lib/utils';
import { useUser, useFirebase } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const [theme, setTheme] = useState('theme-noir');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [isFriendMode, setIsFriendMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUid = params.get('u');
    
    if (sharedUid) {
      setTargetUserId(sharedUid);
      setIsFriendMode(true);
      fetchTargetUserTheme(sharedUid);
    } else if (user) {
      setTargetUserId(user.uid);
      setIsFriendMode(false);
      ensureUserProfile(user.uid);
      const savedTheme = localStorage.getItem('wishstream_theme');
      if (savedTheme) setTheme(savedTheme);
    } else {
      setTargetUserId(null);
      setIsFriendMode(false);
    }
  }, [user]);

  const ensureUserProfile = async (uid: string) => {
    if (!firestore) return;
    const profileRef = doc(firestore, 'userProfiles', uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      await setDoc(profileRef, {
        id: uid,
        displayName: "New Streamer",
        avatarUrl: `https://picsum.photos/seed/${uid}/400/400`,
        theme: 'theme-noir',
        quote: "Minimal desires. Thoughtful acquisitions.",
        createdAt: new Date().toISOString(),
      });
    } else if (profileSnap.data().theme) {
      setTheme(profileSnap.data().theme);
    }
  };

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
    if (user && firestore) {
      setDoc(doc(firestore, 'userProfiles', user.uid), { theme: newTheme }, { merge: true });
    }
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

  // Show landing page if not logged in AND not viewing a shared UID
  if (!user && !isFriendMode) {
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
