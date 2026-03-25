"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User, Mail, Sparkles } from 'lucide-react';

export default function UserSidebar() {
  const avatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full flex flex-col p-12 bg-white relative overflow-hidden">
      {/* Animated Elements for Micro-animations */}
      <div className="absolute top-20 right-10 w-4 h-4 rounded-full bg-accent/20 animate-float" />
      <div className="absolute bottom-40 left-10 w-6 h-6 rounded-full bg-primary/10 animate-float-delayed" />
      <div className="absolute top-1/2 right-20 w-3 h-3 rounded-full bg-accent/30 animate-float-slow" />

      {/* Profile Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary tracking-tight mb-2">WishStream</h1>
          <p className="text-muted-foreground text-sm font-medium">Curate your desires, beautifully.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative group">
            <div className="absolute -inset-4 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors" />
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl transition-transform hover:scale-105 duration-500">
              <Image
                src={avatar?.imageUrl || ''}
                alt="User Profile"
                fill
                className="object-cover"
                data-ai-hint={avatar?.imageHint}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-border">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-primary">Alex Rivers</h2>
            <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> alex@wishstream.io
            </p>
          </div>

          <div className="w-full pt-8 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border/50 group hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Birthdate</p>
                <p className="text-sm font-semibold text-primary">March 15, 1995</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border/50 group hover:border-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Role</p>
                <p className="text-sm font-semibold text-primary">Chief Curator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-12 border-t border-border/50">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>© 2024 WishStream</span>
            <div className="flex gap-4">
              <button className="hover:text-primary transition-colors">Settings</button>
              <button className="hover:text-primary transition-colors">Log out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}