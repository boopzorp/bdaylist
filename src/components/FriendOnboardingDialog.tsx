
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PartyPopper, Ghost, User, ChevronRight, History, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FriendOnboardingDialogProps {
  open: boolean;
  existingGuests: { id: string; name: string; shareName: boolean }[];
  onComplete: (data: { name: string; shareName: boolean; reclaimedId?: string }) => void;
}

export default function FriendOnboardingDialog({ open, existingGuests, onComplete }: FriendOnboardingDialogProps) {
  const [name, setName] = useState('');
  const [shareName, setShareName] = useState(true);
  const [view, setView] = useState<'new' | 'existing'>('new');

  // Automatically switch to 'existing' view if guests are found when the dialog opens
  useEffect(() => {
    if (open) {
      if (existingGuests.length > 0) {
        setView('existing');
      } else {
        setView('new');
      }
    }
  }, [open, existingGuests.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name, shareName });
  };

  const handleSelectExisting = (guest: { id: string; name: string; shareName: boolean }) => {
    onComplete({ name: guest.name, shareName: guest.shareName, reclaimedId: guest.id });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[420px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background">
        <div className="bg-primary p-10 text-primary-foreground relative text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/20 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
                <PartyPopper size={28} className="text-white" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-light tracking-tight">
              {view === 'new' ? 'Join the Stream' : 'Welcome Back'}
            </DialogTitle>
            <p className="text-primary-foreground/60 text-[10px] font-mono uppercase tracking-[0.3em] font-bold">
              {view === 'new' ? 'Identity Verification' : 'Reclaim your presence'}
            </p>
          </div>
        </div>

        <div className="p-0">
          {view === 'new' ? (
            <div className="p-8 pb-4">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-5">
                  <div className="grid gap-3">
                    <Label htmlFor="friendName" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold pl-1">Your Display Name</Label>
                    <Input 
                      id="friendName" 
                      placeholder="e.g. Robin Hood" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-2xl border-border/60 h-14 text-lg font-light focus:ring-primary shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 bg-muted/30 rounded-[1.5rem] border border-border/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-[10px] uppercase tracking-[0.15em] font-bold text-muted-foreground">Public Presence</Label>
                        {shareName ? <User size={12} className="text-primary" /> : <Ghost size={12} className="text-muted-foreground" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground/50 leading-relaxed max-w-[180px]">
                        {shareName ? "Others see your name next to items." : "You appear as 'Anonymous' to guests."}
                      </p>
                    </div>
                    <Switch checked={shareName} onCheckedChange={setShareName} className="data-[state=checked]:bg-primary" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={!name.trim()}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl uppercase text-[11px] tracking-[0.3em] font-bold transition-all shadow-lg shadow-primary/20"
                >
                  Enter Stream
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-8 pb-4 space-y-6">
              <ScrollArea className="h-[240px] pr-4">
                <div className="space-y-3">
                  {existingGuests.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleSelectExisting(guest)}
                      className="w-full flex items-center justify-between p-5 rounded-[1.5rem] border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex flex-col">
                        <span className="text-base font-light text-foreground">{guest.name}</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60">
                          {guest.shareName ? 'Public Profile' : 'Private Profile'}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="mt-4 border-t border-border/40">
            {view === 'new' && existingGuests.length > 0 && (
              <button 
                type="button" 
                onClick={() => setView('existing')}
                className="w-full py-8 text-[11px] uppercase tracking-[0.4em] font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-3"
              >
                <History size={14} /> I'VE BEEN HERE BEFORE
              </button>
            )}
            
            {view === 'existing' && (
              <button 
                type="button" 
                onClick={() => setView('new')}
                className="w-full py-8 text-[11px] uppercase tracking-[0.4em] font-bold text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-3"
              >
                ENTER AS SOMEONE ELSE <ArrowLeft size={14} className="rotate-180" />
              </button>
            )}
          </div>
          
          <div className="bg-muted/30 py-6 px-8 flex justify-center items-center">
            <p className="text-[9px] text-muted-foreground/40 text-center uppercase tracking-[0.25em] leading-relaxed">
              Admin will only see counts,<br />never names.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
