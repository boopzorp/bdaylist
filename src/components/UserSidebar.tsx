"use client";

import React, { useEffect, useState } from 'react';
import { Cake, Gift, PartyPopper, UserCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UserSidebarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
}

export default function UserSidebar({ currentTheme, onThemeChange, isAdmin, onAdminToggle }: UserSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { id: 'theme-noir', color: 'bg-neutral-900', label: 'Noir' },
    { id: 'theme-birthday', color: 'bg-pink-400', label: 'Birthday' },
    { id: 'theme-mint', color: 'bg-emerald-400', label: 'Mint' },
    { id: 'theme-sunset', color: 'bg-orange-400', label: 'Sunset' },
    { id: 'theme-lavender', color: 'bg-purple-400', label: 'Lavender' },
  ];

  return (
    <aside className="w-full h-full bg-background flex flex-col justify-center items-center relative overflow-hidden p-6 md:p-8 lg:p-12">
      {/* Background Abstract Elements - Hidden or simplified on mobile */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-border rounded-full animate-float-slow opacity-30 md:opacity-50" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-border rotate-45 animate-float-slower opacity-30 md:opacity-50" />
      
      {/* Playful Floating Elements (Visible in Birthday Theme) */}
      <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-1000", currentTheme === 'theme-birthday' ? 'opacity-20' : 'opacity-0')}>
        <Cake size={24} className="absolute top-6 left-6 md:top-10 md:left-10 animate-float-slow text-primary" />
        <Gift size={20} className="absolute bottom-12 right-12 md:bottom-20 md:right-20 animate-float-slower text-accent" />
        <PartyPopper size={22} className="absolute top-1/2 right-6 md:right-10 animate-float-slow text-primary" />
      </div>

      {/* Profile Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xs md:max-w-none">
        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-border bg-card p-1 relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-2 text-center">
          Aria Noir
        </h1>
        
        <div className="flex flex-col items-center gap-3 md:gap-4 mt-4 md:mt-8 font-mono text-xs md:text-sm tracking-tight text-muted-foreground">
          <span className="uppercase tracking-widest bg-muted/50 px-4 py-1 rounded-full border border-border/40 opacity-80">
            Oct 24
          </span>
          <p className="max-w-[180px] md:max-w-[220px] text-center italic leading-relaxed opacity-70 px-2">
            "Minimalism is about focusing on what matters."
          </p>
        </div>

        {/* Theme Switcher */}
        <div className="mt-8 md:mt-12 flex items-center gap-3">
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

        {/* Admin Toggle */}
        <div className="mt-8 md:mt-12">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAdminToggle}
            className="rounded-full text-[9px] md:text-[10px] uppercase tracking-widest h-8 px-4 border-border/60 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {isAdmin ? (
              <><UserCircle size={14} className="mr-2" /> Admin View</>
            ) : (
              <><Eye size={14} className="mr-2" /> Consumer View</>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
