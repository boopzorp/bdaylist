
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
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore, auth } = useFirebase();
  
  // Initialize with static defaults to prevent hydration mismatch
  const [theme, setTheme] = useState('theme-noir');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [isFriendMode, setIsFriendMode] = useState(false);
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Handle hydration and read browser-only state
  useEffect(() => {
    setHasHydrated(true);
    
    // Read theme
    const savedTheme = localStorage.getItem('wishstream_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Read URL params
    const params = new URLSearchParams(window.location.search);
    const uParam = params.get('u');
    
    // If we have a friend UID but no user, auto-sign in anonymously
    if (uParam && !user && !isUserLoading && auth) {
      initiateAnonymousSignIn(auth);
    }

    const effectiveUserId = uParam || (user?.uid ?? null);
    
    setTargetUserId(effectiveUserId);
    setIsFriendMode(!!uParam && uParam !== user?.uid);
  }, [user, isUserLoading, auth]);

  // Sync theme class to body so Portals (Dialogs) pick up variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const body = document.body;
      const themeClasses = ['theme-noir', 'theme-birthday', 'theme-mint', 'theme-sunset', 'theme-lavender'];
      body.classList.remove(...themeClasses);
      body.classList.add(theme);
    }
  }, [theme]);

  const profileRef = useMemoFirebase(() => {
    // SECURITY: We must be signed in to read any profile according to rules
    if (!firestore || !targetUserId || !user) return null;
    return doc(firestore, 'userProfiles', targetUserId);
  }, [firestore, targetUserId, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading || !hasHydrated) return;
    
    // If not logged in and not in friend mode, we show landing page
    if (!user && !isFriendMode) return;

    if (profile) {
      if (profile.theme && profile.theme !== theme) {
        setTheme(profile.theme);
        localStorage.setItem('wishstream_theme', profile.theme);
      }
      setShowSetup(false);
    } else if (user && user.uid === targetUserId && !isProfileLoading) {
      // Only show setup if we are looking at our own profile and it doesn't exist
      setShowSetup(true);
    }
  }, [profile, isProfileLoading, user, isUserLoading, targetUserId, isFriendMode, theme, hasHydrated]);

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

  // Wait for hydration to avoid mismatch on browser-specific logic
  // Also wait for user if we are in friend mode to satisfy security rules
  const isGlobalLoading = !hasHydrated || isUserLoading || (isFriendMode && !user) || (!!targetUserId && isProfileLoading);

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
            {!hasHydrated ? "Connecting..." : isUserLoading ? "Identifying Stream..." : (isFriendMode && !user) ? "Identifying Guest..." : "Fetching Desires..."}
          </p>
        </div>
      </div>
    );
  }

  // If no user and no shared link being viewed, show landing page
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
