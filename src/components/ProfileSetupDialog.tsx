"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Cake, Sparkles, User, Quote, Image as ImageIcon } from 'lucide-react';

interface ProfileSetupDialogProps {
  open: boolean;
  onComplete: (data: { displayName: string; birthdate: string; quote: string; avatarUrl: string }) => void;
}

export default function ProfileSetupDialog({ open, onComplete }: ProfileSetupDialogProps) {
  const [displayName, setDisplayName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [quote, setQuote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !birthdate) return;
    onComplete({ 
      displayName, 
      birthdate, 
      quote, 
      avatarUrl: avatarUrl || `https://picsum.photos/seed/${Math.random()}/400/400`
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        <div className="bg-primary p-10 text-primary-foreground relative overflow-hidden text-center">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
          <DialogTitle className="text-3xl font-light tracking-tight mb-3">Setup Your Stream</DialogTitle>
          <DialogDescription className="text-primary-foreground/60 text-xs uppercase tracking-[0.3em] font-mono font-bold">
            Customize your BddayList identity
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="displayName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">How should friends call you?</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input 
                  id="displayName" 
                  placeholder="e.g. Birthday King" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 h-12 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Profile Image URL (Optional)</Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input 
                  id="avatarUrl" 
                  placeholder="https://example.com/photo.jpg" 
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 h-12 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthdate" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">When is the big day?</Label>
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input 
                  id="birthdate" 
                  type="date" 
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 h-12 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quote" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">A minimalist quote for your stream</Label>
              <div className="relative">
                <Quote className="absolute left-3 top-4 w-4 h-4 text-muted-foreground/50" />
                <Textarea 
                  id="quote" 
                  placeholder="Focus on what matters." 
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 min-h-[80px] focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white uppercase text-[11px] tracking-[0.3em] font-bold shadow-lg shadow-primary/20">
            <Sparkles size={16} className="mr-2" /> Launch my BddayList
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
