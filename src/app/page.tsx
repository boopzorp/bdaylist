"use client";

import React, { useState, useEffect, useMemo } from 'react';
import UserSidebar from '@/components/UserSidebar';
import WishlistPanel from '@/components/WishlistPanel';
import LandingPage from '@/components/LandingPage';
import ProfileSetupDialog from '@/components/ProfileSetupDialog';
import { cn } from '@/lib/utils';
import { useUser, useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Sparkles, PartyPopper } from 'lucide-react';

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
    const uParam = params.get('u');
    return !!uParam && uParam !== user?.uid;
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
    } else if (user && user.uid === targetUserId && !isProfileLoading) {
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

  // Determine if we should show a loading screen
  // 1. We are waiting for Auth
  // 2. We have a target ID (ours or a friend's) but we are still waiting for that specific profile doc
  const isGlobalLoading = isUserLoading || (!!targetUserId && isProfileLoading);

  if (isGlobalLoading) {
    return (
      <div className={cn("min-h-screen bg-background flex flex-col items-center justify-center transition-colors duration-500", theme)}>
        <div className="relative">
          <div className="w-16 h-16 border-2 border-primary/10 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin" />
          </div>
          <div className="absolute -top-4 -right-4 text-accent animate-bounce">
            <Sparkles size={16} />
          </div>
          <div className="absolute -bottom-4 -left-4 text-primary animate-float-slow opacity-50">
            <PartyPopper size={14} />
          </div>
        </div>
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-xl font-extralight tracking-widest text-foreground animate-pulse uppercase">
            Bdday<span className="font-normal italic">List</span>
          </h2>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-mono">
            {isUserLoading ? "Identifying Stream..." : "Fetching Desires..."}
          </p>
        </div>
      </div>
    );
  }

  // Only show landing page if we are definitively NOT logged in and NOT looking at a friend's stream
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
