"use client";

import React, { useState, useEffect, useMemo } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';
import LandingPage from '@/components/LandingPage';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { cn } from '@/lib/utils';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wishstream_theme') || 'theme-noir';
    }
    return 'theme-noir';
  });

  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const targetUserId = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('u') || (user?.uid ?? null);
  }, [user]);

  const isFriendMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return !!params.get('u') && params.get('u') !== user?.uid;
  }, [user]);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !targetUserId) return null;
    return doc(firestore, 'userProfiles', targetUserId);
  }, [firestore, targetUserId]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  useEffect(() => {
    // If we're loading either the auth state or the profile data, wait.
    if (isUserLoading || isProfileLoading) return;
    
    // If no user is logged in and we're not in friend mode, we're on landing page.
    if (!user && !isFriendMode) return;

    if (profile) {
      if (profile.theme && profile.theme !== theme) {
        setTheme(profile.theme);
        localStorage.setItem('wishstream_theme', profile.theme);
      }
      setShowSetup(false);
    } else if (user && user.uid === targetUserId) {
      // Profile definitively doesn't exist after loading check, and we are the owner
      setShowSetup(true);
    }
  }, [profile, isProfileLoading, user, isUserLoading, targetUserId, isFriendMode, theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('wishstream_theme', newTheme);
    if (user && firestore && user.uid === targetUserId) {
      setDoc(doc(firestore, 'userProfiles', user.uid), { theme: newTheme }, { merge: true });
    }
  };

  const handleToggleProfile = (collapsed: boolean) => {
    setIsProfileCollapsed(collapsed);
  };

  const handleSetupComplete = async (data: { displayName: string; birthdate: string; quote: string; avatarUrl: string }) => {
    if (!user || !firestore) return;
    const profileRef = doc(firestore, 'userProfiles', user.uid);
    await setDoc(profileRef, {
      id: user.uid,
      ...data,
      theme: theme,
      createdAt: new Date().toISOString(),
    });
    setShowSetup(false);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin opacity-20" />
      </div>
    );
  }

  if (!user && !isFriendMode) {
    return <LandingPage currentTheme={theme} onThemeChange={handleThemeChange} />;
  }

  return (
    <div className={cn("flex flex-col md:flex-row min-h-screen bg-background transition-colors duration-500", theme)}>
      {!isProfileCollapsed && (
        <div className={cn(
          "w-full md:w-[35%] lg:w-[30%] border-b md:border-b-0 md:border-r border-border md:sticky md:top-0 md:h-screen shrink-0 transition-all duration-500",
          isProfileCollapsed ? "hidden" : "block"
        )}>
          <UserSidebar 
            currentTheme={theme} 
            onThemeChange={handleThemeChange} 
            isAdmin={!isFriendMode} 
            targetUserId={targetUserId}
          />
        </div>
      )}

      <main className="flex-1 bg-card min-h-screen">
        <WishlistPanel 
          isAdmin={!isFriendMode} 
          targetUserId={targetUserId}
          isProfileCollapsed={isProfileCollapsed}
          onToggleProfile={handleToggleProfile}
        />
      </main>

      <ProfileSetupDialog open={showSetup} onComplete={handleSetupComplete} />
    </div>
  );
}
