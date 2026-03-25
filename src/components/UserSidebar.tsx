"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Cake, Gift, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserSidebarProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function UserSidebar({ currentTheme, onThemeChange }: UserSidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { id: 'theme-noir', color: 'bg-neutral-900', label: 'Noir' },
    { id: 'theme-birthday', color: 'bg-pink-400', label: 'Birthday' },
    { id: 'theme-mint', color: 'bg-emerald-400', label: 'Mint' },
  ];

  return (
    <aside className="w-full h-full bg-background flex flex-col justify-center items-center relative overflow-hidden p-8 lg:p-12">
      {/* Background Abstract Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-border rounded-full animate-float-slow opacity-50" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-border rotate-45 animate-float-slower opacity-50" />
      
      {/* Playful Floating Elements (Visible in Birthday Theme) */}
      <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-1000", currentTheme === 'theme-birthday' ? 'opacity-20' : 'opacity-0')}>
        <Cake size={24} className="absolute top-10 left-10 animate-float-slow text-primary" />
        <Gift size={20} className="absolute bottom-20 right-20 animate-float-slower text-accent" />
        <PartyPopper size={22} className="absolute top-1/2 right-10 animate-float-slow text-primary" />
      </div>

      {/* Profile Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          <div className="w-32 h-32 rounded-full overflow-hidden border border-border bg-card p-1 relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>

        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-foreground mb-2 text-center">
          Aria Noir
        </h1>
        
        <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground font-mono tracking-tight mt-6">
          <div className="flex items-center gap-2 bg-card/60 px-4 py-1.5 rounded-full border border-border shadow-sm backdrop-blur-sm">
            <Calendar size={14} className="text-primary" />
            <span>Oct 24, 1996</span>
          </div>
          <div className="flex items-center gap-2 bg-card/60 px-4 py-1.5 rounded-full border border-border shadow-sm backdrop-blur-sm">
            <MapPin size={14} className="text-primary" />
            <span>Copenhagen, DK</span>
          </div>
        </div>

        {/* Theme Switcher */}
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

        <div className="mt-8 text-center">
           <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
             Curated desires & thoughtful acquisitions.
           </p>
        </div>
      </div>
    </aside>
  );
}
