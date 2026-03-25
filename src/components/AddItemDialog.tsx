"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Plus, X } from 'lucide-react';
import { suggestWishlistItemDetails } from '@/ai/flows/suggest-wishlist-item-details';
import { WishlistItem } from '@/components/WishlistPanel';
import { toast } from '@/hooks/use-toast';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
}

export default function AddItemDialog({ open, onOpenChange, onAdd }: AddItemDialogProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const resetForm = () => {
    setName('');
    setUrl('');
    setDescription('');
    setTags([]);
    setTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({ name, url, description, tags });
    onOpenChange(false);
    resetForm();
  };

  const handleEnhance = async () => {
    if (!name.trim() && !url.trim()) {
      toast({
        title: "Missing Info",
        description: "Please provide at least a title or a URL for AI enhancement.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const result = await suggestWishlistItemDetails({
        title: name || undefined,
        url: url || undefined,
      });

      if (result) {
        setDescription(result.suggestedDescription);
        setTags(prev => Array.from(new Set([...prev, ...result.suggestedTags])));
        toast({
          title: "AI Enhancement Ready",
          description: "We've added a description and some relevant tags for you."
        });
      }
    } catch (error) {
      console.error("Enhancement failed:", error);
      toast({
        title: "Enhancement Error",
        description: "Could not fetch AI suggestions at this time.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="bg-primary p-8 text-primary-foreground relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <DialogTitle className="text-2xl font-headline font-bold mb-2">Add New Wish</DialogTitle>
          <DialogDescription className="text-primary-foreground/70 font-medium">
            Fill in the details for your next desired item.
          </DialogDescription>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold text-primary">Item Name</Label>
              <Input 
                id="name" 
                placeholder="e.g. Ergonomic Keyboard" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-border/60 focus:ring-accent h-11"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="url" className="text-sm font-semibold text-primary">External URL (Optional)</Label>
                <button 
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || (!name && !url)}
                  className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/80 disabled:opacity-50 transition-colors"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  AI ENHANCE
                </button>
              </div>
              <Input 
                id="url" 
                placeholder="https://amazon.com/item-id" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-xl border-border/60 focus:ring-accent h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-semibold text-primary">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Why do you want this?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] rounded-xl border-border/60 focus:ring-accent resize-none"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm font-semibold text-primary">Tags</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a tag..." 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="rounded-xl border-border/60 h-10"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="outline"
                  className="h-10 px-3 rounded-xl border-border/60"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 bg-background border border-border/40 rounded-full text-xs font-medium text-primary group transition-colors hover:border-accent/40">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-xl bg-primary text-white hover:bg-primary/90 px-8"
              disabled={!name.trim()}
            >
              Save Wish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}