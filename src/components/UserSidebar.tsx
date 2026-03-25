"use client";

import React, { useEffect, useState } from 'react';
import { Cake, Gift, PartyPopper, Share2, Users, LogOut, Sparkles, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { initiateSignOut } from '@/firebase/non-blocking-login';
import { format } from 'date-fns';
import EditProfileDialog from '@/components/EditProfileDialog';

interface UserSidebarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isAdmin: boolean;
  targetUserId: string | null;
}

export default function UserSidebar({ currentTheme, onThemeChange, isAdmin, targetUserId }: UserSidebarProps) {
  const { user, auth, firestore } = useFirebase();
  const [mounted, setMounted] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !targetUserId) return null;
    return doc(firestore, 'userProfiles', targetUserId);
  }, [firestore, targetUserId]);

  const { data: profile } = useDoc(profileRef);

  const friendsQuery = useMemoFirebase(() => {
    if (!firestore || !targetUserId) return null;
    return doc(firestore, 'userProfiles', targetUserId, 'guests', 'list');
  }, [firestore, targetUserId]);

  const { data: guestListDoc } = useDoc(friendsQuery);
  const guestList = (guestListDoc?.guests as any[]) || [];

  if (!mounted) return null;

  const themes = [
    { id: 'theme-noir', color: 'bg-neutral-900', label: 'Noir' },
    { id: 'theme-birthday', color: 'bg-pink-400', label: 'Birthday' },
    { id: 'theme-mint', color: 'bg-emerald-400', label: 'Mint' },
    { id: 'theme-sunset', color: 'bg-orange-400', label: 'Sunset' },
    { id: 'theme-lavender', color: 'bg-purple-400', label: 'Lavender' },
  ];

  const handleShare = () => {
    const url = `${window.location.origin}?u=${user?.uid}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Share this link with your friends to see your BddayList.",
    });
  };

  const handleLogout = () => {
    if (auth) {
      initiateSignOut(auth);
      window.location.href = '/';
    }
  };

  const handleSaveProfile = async (data: any) => {
    if (!user || !firestore) return;
    await setDoc(doc(firestore, 'userProfiles', user.uid), data, { merge: true });
    toast({
      title: "Profile Updated",
      description: "Your settings have been saved.",
    });
  };

  const formattedBirthday = profile?.birthdate 
    ? format(new Date(profile.birthdate), 'MMM dd').toUpperCase()
    : "OCT 24";

  return (
    <aside className="w-full h-full bg-background flex flex-col justify-center items-center relative overflow-hidden p-8 md:p-8 lg:p-12">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-border rounded-full animate-float-slow opacity-30 md:opacity-50" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-border rotate-45 animate-float-slower opacity-30 md:opacity-50" />
      
      <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-1000", currentTheme === 'theme-birthday' ? 'opacity-20' : 'opacity-0')}>
        <Cake size={24} className="absolute top-6 left-6 md:top-10 md:left-10 animate-float-slow text-primary" />
        <Gift size={20} className="absolute bottom-12 right-12 md:bottom-20 md:right-20 animate-float-slower text-accent" />
        <PartyPopper size={22} className="absolute top-1/2 right-6 md:right-10 animate-float-slow text-primary" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs md:max-w-none">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-20" />
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-border bg-card p-1 relative z-10 shadow-inner">
            <img 
              src={profile?.avatarUrl || "https://picsum.photos/seed/bdday-user/400/400"} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsEditDialogOpen(true)}
              className="absolute -right-2 -bottom-2 bg-primary text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <Settings2 size={16} />
            </button>
          )}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl text-foreground mb-1 font-caveat tracking-tight">
            {profile?.displayName || (isAdmin ? "Your Stream" : "Bdday Stream")}
          </h1>
          <div className="flex items-center justify-center gap-2 opacity-30">
            <div className="w-8 h-[1px] bg-foreground" />
            <Sparkles size={10} />
            <div className="w-8 h-[1px] bg-foreground" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6 font-mono">
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] bg-muted/50 px-5 py-2 rounded-full border border-border/40 opacity-80 text-muted-foreground shadow-sm">
            {formattedBirthday}
          </span>
          <p className="max-w-[200px] text-center text-[10px] md:text-[11px] uppercase tracking-widest leading-relaxed opacity-60 px-4 font-light italic">
            {showFriends ? "Guestbook" : (profile?.quote || "Focus on what matters.")}
          </p>
        </div>

        {showFriends ? (
          <div className="mt-8 w-full max-w-[200px] flex flex-col gap-3 font-mono animate-in fade-in slide-in-from-bottom-2 duration-500">
            {guestList.length > 0 ? guestList.filter(g => g.shareName).map((guest, idx) => (
              <div key={idx} className="text-[9px] uppercase tracking-widest text-center border-b border-border/20 pb-2 last:border-0">
                {guest.name}
              </div>
            )) : (
              <div className="text-[9px] uppercase tracking-widest text-center opacity-40">No public guests yet</div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowFriends(false)} className="mt-4 text-[8px] uppercase tracking-[0.2em]">Back to Stream</Button>
          </div>
        ) : (
          <>
            {isAdmin && (
              <div className="mt-12 flex items-center gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onThemeChange(t.id)}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-300 ring-offset-2 ring-offset-background hover:scale-125",
                      t.color,
                      currentTheme === t.id ? "ring-2 ring-primary" : "ring-1 ring-border"
                    )}
                    title={t.label}
                  />
                ))}
              </div>
            )}

            <div className="mt-12 flex flex-col gap-3 w-full max-w-[180px]">
              {isAdmin ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShare}
                    className="rounded-full text-[9px] uppercase tracking-widest h-10 px-5 border-border/60 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                  >
                    <Share2 size={14} className="mr-2" /> Share BddayList
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-[8px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-destructive transition-all"
                  >
                    <LogOut size={12} className="mr-2" /> Log Out
                  </Button>
                </>
              ) : (
                <div className="bg-muted/30 p-4 rounded-2xl border border-border/40 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-light italic">Viewing Bdday Stream</span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFriends(true)}
                className="text-[8px] uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-all"
              >
                <Users size={12} className="mr-2" /> Guestbook
              </Button>
            </div>
          </>
        )}
      </div>

      {profile && (
        <EditProfileDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          initialData={{
            displayName: profile.displayName || '',
            birthdate: profile.birthdate || '',
            quote: profile.quote || '',
            avatarUrl: profile.avatarUrl || ''
          }}
          onSave={handleSaveProfile}
        />
      )}
    </aside>
  );
}
