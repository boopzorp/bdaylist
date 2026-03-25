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
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Mail, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'signup';
}

export default function AuthDialog({ open, onOpenChange, mode: initialMode }: AuthDialogProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      initiateEmailSignIn(auth, email, password);
    } else {
      initiateEmailSignUp(auth, email, password);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-background">
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <DialogTitle className="text-2xl font-light tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Stream'}
          </DialogTitle>
          <DialogDescription className="text-primary-foreground/60 text-xs uppercase tracking-widest font-mono">
            {mode === 'login' ? 'Continue your BddayList' : 'Start your minimalist wishlist'}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 h-12 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 rounded-xl border-border/60 h-12 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-[10px] tracking-widest font-bold">
            {mode === 'login' ? <><LogIn size={14} className="mr-2" /> Sign In</> : <><UserPlus size={14} className="mr-2" /> Create Account</>}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-mono"><span className="bg-background px-2 text-muted-foreground">OR</span></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={() => initiateAnonymousSignIn(auth)}
            className="w-full h-12 rounded-xl border-border/60 text-[10px] uppercase tracking-widest font-bold"
          >
            <Sparkles size={14} className="mr-2" /> Quick Anonymous Entry
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
