"use client";

import React, { useState } from 'react';
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
import { PartyPopper, Ghost, User } from 'lucide-react';

interface FriendOnboardingDialogProps {
  open: boolean;
  onComplete: (data: { name: string; shareName: boolean }) => void;
}

export default function FriendOnboardingDialog({ open, onComplete }: FriendOnboardingDialogProps) {
  const [name, setName] = useState('');
  const [shareName, setShareName] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onComplete({ name, shareName });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-background">
        <div className="bg-primary p-8 text-primary-foreground relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
          <PartyPopper size={32} className="mb-4 opacity-50" />
          <DialogTitle className="text-2xl font-extralight tracking-tight mb-2">Welcome to the Stream</DialogTitle>
          <p className="text-primary-foreground/60 text-xs font-mono uppercase tracking-widest">Identify yourself to join</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="friendName" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Your Display Name</Label>
              <Input 
                id="friendName" 
                placeholder="e.g. Robin Hood" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border/60 h-12 text-lg font-light focus:ring-primary"
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Public Presence</Label>
                  {shareName ? <User size={12} className="text-primary" /> : <Ghost size={12} className="text-muted-foreground" />}
                </div>
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-[180px]">
                  {shareName ? "Others can see your name next to items you fulfill." : "You will appear as 'Anonymous' to everyone."}
                </p>
              </div>
              <Switch checked={shareName} onCheckedChange={setShareName} />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!name.trim()}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl uppercase text-[10px] tracking-[0.3em] transition-all"
          >
            Enter Stream
          </Button>
          
          <p className="text-[9px] text-muted-foreground/40 text-center uppercase tracking-widest leading-relaxed">
            Admin will only see counts,<br />never names.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
