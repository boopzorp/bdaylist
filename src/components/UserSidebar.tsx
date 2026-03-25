"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';

export default function UserSidebar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside className="w-full h-full bg-neutral-100/50 flex flex-col justify-center items-center relative overflow-hidden p-8 lg:p-12">
      {/* Background Abstract Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-neutral-200 rounded-full animate-float-slow opacity-50" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-neutral-200 rotate-45 animate-float-slower opacity-50" />
      <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-neutral-300 rounded-full animate-ping" style={{ animationDuration: '4s' }} />

      {/* Profile Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Avatar with Micro-animation ring */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          <div className="w-32 h-32 rounded-full overflow-hidden border border-neutral-200 bg-white p-1 relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full filter grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
            />
          </div>
        </div>

        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-neutral-900 mb-2 text-center">
          Aria Noir
        </h1>
        
        <div className="flex flex-col items-center gap-3 text-sm text-neutral-500 font-mono tracking-tight mt-6">
          <div className="flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full border border-neutral-100 shadow-sm backdrop-blur-sm">
            <Calendar size={14} className="text-neutral-400" />
            <span>Oct 24, 1996</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-4 py-1.5 rounded-full border border-neutral-100 shadow-sm backdrop-blur-sm">
            <MapPin size={14} className="text-neutral-400" />
            <span>Copenhagen, DK</span>
          </div>
        </div>

        <div className="mt-12 text-center">
           <p className="text-xs text-neutral-400 uppercase tracking-widest leading-relaxed max-w-[200px]">
             Curated desires & thoughtful acquisitions.
           </p>
        </div>
      </div>
    </aside>
  );
}
