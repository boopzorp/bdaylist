"use client";

import React, { useState } from 'react';
import { PartyPopper, Gift, Sparkles, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthDialog from '@/components/AuthDialog';

export default function LandingPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100/50 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50/50 rounded-full blur-[120px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-purple-50/30 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl text-center space-y-16">
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
          
          <div className="flex flex-col items-center justify-center gap-6 pt-8">
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
            
            <div className="flex items-center gap-4 text-muted-foreground/50 font-mono text-[9px] uppercase tracking-widest pt-4">
              <span className="flex items-center gap-1.5"><Sparkles size={10} /> AI-Enhanced</span>
              <span className="flex items-center gap-1.5"><PartyPopper size={10} /> Private Mode</span>
              <span className="flex items-center gap-1.5"><Gift size={10} /> Shared Lists</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="w-12 h-[1px] bg-border mb-2" />
        <span className="text-muted-foreground/30 font-mono text-[9px] uppercase tracking-widest">
          EST. 2024 • Minimalist Gifting
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
