"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { 
  initiateEmailSignIn, 
  initiateEmailSignUp, 
  initiateAnonymousSignIn,
  initiatePasswordReset 
} from '@/firebase/non-blocking-login';
import { 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'signup';
  onAnonymousSuccess?: () => void;
}

function getReadableAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please verify your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a few moments or reset your password.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently disabled.';
    default:
      if (error?.message) {
        return error.message.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\.?$/, '');
      }
      return 'An unexpected error occurred. Please try again.';
  }
}

export default function AuthDialog({ open, onOpenChange, mode: initialMode, onAnonymousSuccess }: AuthDialogProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const auth = useAuth();

  // Keep mode in sync with props when opened
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
    }
  }, [open, initialMode]);

  const handleModeChange = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'reset') {
      if (!auth) {
        setError('Authentication service is currently unavailable.');
        return;
      }
      setIsLoading(true);
      try {
        await initiatePasswordReset(auth, trimmedEmail);
        setSuccessMessage('Password reset link sent! Check your inbox to set a new password.');
      } catch (err: any) {
        setError(getReadableAuthError(err));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!auth) {
      setError('Authentication service is currently unavailable.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await initiateEmailSignIn(auth, trimmedEmail, password);
      } else {
        await initiateEmailSignUp(auth, trimmedEmail, password);
      }
      // On success, close dialog and reset
      onOpenChange(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(getReadableAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    if (!auth) {
      setError('Authentication service is currently unavailable.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setIsAnonymousLoading(true);
    try {
      if (!auth.currentUser) {
        await initiateAnonymousSignIn(auth);
      }
      onOpenChange(false);
      onAnonymousSuccess?.();
    } catch (err: any) {
      setError(getReadableAuthError(err));
    } finally {
      setIsAnonymousLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isLoading && !isAnonymousLoading) {
        onOpenChange(val);
      }
    }}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-background">
        {/* Header Header */}
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-accent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <DialogTitle className="text-2xl font-light tracking-tight mb-2">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Stream'}
              {mode === 'reset' && 'Reset Password'}
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/70 text-xs uppercase tracking-widest font-mono font-medium">
              {mode === 'login' && 'Continue your BddayList'}
              {mode === 'signup' && 'Start your minimalist wishlist'}
              {mode === 'reset' && 'We will send a recovery email'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="grid gap-1.5">
              <Label htmlFor="auth-email" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold pl-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                <Input 
                  id="auth-email" 
                  type="email" 
                  autoComplete="email"
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isAnonymousLoading}
                  className="pl-10 rounded-xl border-border/60 h-12 text-sm focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Password Field (for login / signup) */}
            {mode !== 'reset' && (
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between pl-1">
                  <Label htmlFor="auth-password" className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    Password
                  </Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('reset')}
                      className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-wider"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                  <Input 
                    id="auth-password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
                    placeholder={mode === 'signup' ? "Min. 6 characters" : "••••••••"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isAnonymousLoading}
                    className="pl-10 pr-10 rounded-xl border-border/60 h-12 text-sm focus-visible:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading || isAnonymousLoading}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-[10px] tracking-widest font-bold shadow-md shadow-primary/10 transition-all duration-200"
          >
            {isLoading ? (
              <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</>
            ) : mode === 'login' ? (
              <><LogIn size={14} className="mr-2" /> Sign In</>
            ) : mode === 'signup' ? (
              <><UserPlus size={14} className="mr-2" /> Create Account</>
            ) : (
              <><KeyRound size={14} className="mr-2" /> Send Reset Link</>
            )}
          </Button>

          {/* Anonymous Entry & Secondary Options */}
          {mode !== 'reset' && (
            <>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-[0.3em] font-mono"><span className="bg-background px-3 text-muted-foreground">OR</span></div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAnonymousSignIn}
                disabled={isLoading || isAnonymousLoading}
                className="w-full h-12 rounded-xl border-border/60 text-[10px] uppercase tracking-widest font-bold hover:bg-muted/60 transition-all duration-200"
              >
                {isAnonymousLoading ? (
                  <><Loader2 size={14} className="mr-2 animate-spin" /> Entering as Guest...</>
                ) : (
                  <><Sparkles size={14} className="mr-2 text-primary" /> Quick Anonymous Entry</>
                )}
              </Button>
            </>
          )}

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-[11px] text-muted-foreground">
            {mode === 'login' && (
              <p>
                Don&apos;t have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => handleModeChange('signup')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button 
                  type="button" 
                  onClick={() => handleModeChange('login')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button 
                type="button" 
                onClick={() => handleModeChange('login')}
                className="inline-flex items-center text-primary font-semibold hover:underline gap-1 text-[11px]"
              >
                <ArrowLeft size={12} /> Back to Sign In
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

