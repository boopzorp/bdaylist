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
import { Textarea } from '@/components/ui/textarea';
import { User, Cake, Quote, Image as ImageIcon } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    displayName: string;
    birthdate: string;
    quote: string;
    avatarUrl: string;
  };
  onSave: (data: { displayName: string; birthdate: string; quote: string; avatarUrl: string }) => void;
}

export default function EditProfileDialog({ open, onOpenChange, initialData, onSave }: EditProfileDialogProps) {
  const [displayName, setDisplayName] = useState(initialData.displayName);
  const [birthdate, setBirthdate] = useState(initialData.birthdate);
  const [quote, setQuote] = useState(initialData.quote);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl);

  useEffect(() => {
    if (open) {
      setDisplayName(initialData.displayName);
      setBirthdate(initialData.birthdate);
      setQuote(initialData.quote);
      setAvatarUrl(initialData.avatarUrl);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !birthdate) return;
    onSave({ displayName, birthdate, quote, avatarUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-background">
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden text-center">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
          <DialogTitle className="text-2xl font-light tracking-tight mb-1">Edit Profile</DialogTitle>
          <p className="text-primary-foreground/60 text-[10px] uppercase tracking-widest font-mono">Refine your identity</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="editDisplayName" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input 
                id="editDisplayName" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10 rounded-xl border-border/60 h-11 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="editAvatarUrl" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Profile Image URL</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input 
                id="editAvatarUrl" 
                placeholder="https://example.com/photo.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="pl-10 rounded-xl border-border/60 h-11 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="editBirthdate" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Birthdate</Label>
            <div className="relative">
              <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input 
                id="editBirthdate" 
                type="date" 
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="pl-10 rounded-xl border-border/60 h-11 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="editQuote" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Minimal Quote</Label>
            <div className="relative">
              <Quote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground/50" />
              <Textarea 
                id="editQuote" 
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="pl-10 rounded-xl border-border/60 min-h-[80px] focus:ring-primary resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
