"use client";

import React, { useState, useEffect } from 'react';
import { PartyPopper, Gift, Sparkles, ChevronRight, Heart, ShoppingBag, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthDialog from '@/components/AuthDialog';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LandingPageProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function LandingPage({ currentTheme, onThemeChange }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const themes = [
    { id: 'theme-noir', color: 'bg-neutral-900', label: 'Noir' },
    { id: 'theme-birthday', color: 'bg-pink-400', label: 'Birthday' },
    { id: 'theme-mint', color: 'bg-emerald-400', label: 'Mint' },
    { id: 'theme-sunset', color: 'bg-orange-400', label: 'Sunset' },
    { id: 'theme-lavender', color: 'bg-purple-400', label: 'Lavender' },
  ];

  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative transition-colors duration-700 bg-background", currentTheme)}>
      {/* Interactive Cursor Spotlight */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsla(var(--primary), 0.15), transparent 80%)`,
        }}
      />
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-accent/20 rounded-full blur-[140px] animate-float-slower" />
      </div>

      {/* Neat Theme Menu */}
      <div className="absolute top-8 right-8 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full gap-2 text-[10px] uppercase tracking-widest font-mono opacity-60 hover:opacity-100">
              <Palette size={14} /> Change Vibe
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/80 backdrop-blur-md border-border/50 rounded-2xl p-2 min-w-[140px]">
            {themes.map((t) => (
              <DropdownMenuItem 
                key={t.id} 
                onClick={() => onThemeChange(t.id)}
                className="flex items-center gap-3 cursor-pointer rounded-xl p-2 focus:bg-primary/5"
              >
                <div className={cn("w-3 h-3 rounded-full", t.color)} />
                <span className="text-[10px] uppercase tracking-widest font-mono">{t.label}</span>
                {currentTheme === t.id && <div className="ml-auto w-1 h-1 bg-primary rounded-full" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 max-w-3xl text-center space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 text-primary/30">
            <ShoppingBag size={18} />
            <div className="w-8 h-[1px] bg-current" />
            <Heart size={18} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter text-foreground leading-tight">
            Bdday<span className="font-normal italic text-primary">List</span>
          </h1>
          
          <p className="text-muted-foreground text-[10px] md:text-xs font-mono uppercase tracking-[0.4em]">
            THE "NO MORE GIFT RECEIPTS" BIRTHDAY APP.
          </p>
        </div>

        <div className="space-y-10">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-3xl font-light text-foreground tracking-tight">
              Stop pretending you love that scented candle.
            </h2>
            <p className="text-muted-foreground font-light text-base md:text-lg leading-relaxed italic">
              Drop the subtle hints. Build a sleek list of things you actually want, share it with your favorite people, and let them handle the rest. Surprise included, clutter excluded.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-6 pt-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button 
                onClick={() => setAuthMode('signup')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 py-8 text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-xl shadow-primary/10"
              >
                START DROPPING HINTS <ChevronRight size={14} className="ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => setAuthMode('login')}
                className="rounded-full px-12 py-8 text-[11px] uppercase tracking-[0.2em] border-border hover:bg-muted transition-all"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="w-12 h-[1px] bg-border mb-2" />
        <span className="text-muted-foreground/30 font-mono text-[9px] uppercase tracking-widest">
          Made with ❤️
        </span>
      </footer>

      {authMode && (
        <AuthDialog 
          open={!!authMode} 
          onOpenChange={(open) => !open && setAuthMode(null)} 
          mode={authMode} 
        />
      )}
    </div>
  );
}
