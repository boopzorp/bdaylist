
"use client";

import React from 'react';
import { PartyPopper, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

export default function LandingPage() {
  const auth = useAuth();

  const handleStart = () => {
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-[#787D88]/10 rounded-full animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-[#787D88]/10 rotate-45 animate-float-slower" />
      
      <div className="relative z-10 max-w-2xl text-center space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 text-[#787D88] opacity-50">
            <Gift size={20} />
            <div className="w-12 h-[1px] bg-current" />
            <PartyPopper size={20} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tighter text-[#787D88] leading-tight">
            Wish<span className="font-normal italic">Stream</span>
          </h1>
          
          <p className="text-[#787D88] text-sm md:text-base font-mono uppercase tracking-[0.3em] opacity-60">
            Minimal desires. Thoughtful acquisitions.
          </p>
        </div>

        <div className="space-y-8">
          <p className="text-[#787D88] font-light text-lg md:text-xl leading-relaxed max-w-lg mx-auto italic">
            "Focus on what truly matters. Create a stream of desires and share the joy with your inner circle."
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Button 
              onClick={handleStart}
              className="bg-[#787D88] text-white hover:bg-[#787D88]/90 rounded-full px-10 py-7 text-xs uppercase tracking-widest transition-all hover:scale-105"
            >
              Start your stream <ChevronRight size={14} className="ml-2" />
            </Button>
            
            <div className="flex items-center gap-2 text-[#787D88]/40 font-mono text-[10px] uppercase tracking-widest">
              <Sparkles size={12} /> Simple. Private. Social.
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-12 text-[#787D88]/30 font-mono text-[10px] uppercase tracking-widest">
        Aria Noir © 2024
      </footer>
    </div>
  );
}
