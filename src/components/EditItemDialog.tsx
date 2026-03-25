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
import { Textarea } from '@/components/ui/textarea';
import { WishlistItem, ItemType } from '@/components/WishlistPanel';
import { cn } from '@/lib/utils';

interface EditItemDialogProps {
  item: WishlistItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (item: WishlistItem) => void;
}

export default function EditItemDialog({ item, open, onOpenChange, onUpdate }: EditItemDialogProps) {
  const [name, setName] = useState(item.name);
  const [url, setUrl] = useState(item.url || '');
  const [category, setCategory] = useState(item.category);
  const [type, setType] = useState<ItemType>(item.type || 'like');
  const [note, setNote] = useState(item.note || '');

  const handleSave = () => {
    onUpdate({
      ...item,
      name,
      url,
      category,
      type,
      note,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl overflow-hidden bg-card text-card-foreground">
        <div className="bg-primary/5 p-6 border-b border-border/50">
          <DialogTitle className="text-2xl font-light tracking-tight text-foreground">Edit Wish</DialogTitle>
        </div>
        
        <div className="grid gap-6 p-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Item Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="rounded-xl border-border bg-transparent focus:ring-primary h-12 text-lg font-light"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Category</Label>
              <Input 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="rounded-xl border-border bg-transparent h-10"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Priority</Label>
              <div className="flex gap-1">
                <button
                  onClick={() => setType('like')}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-[9px] uppercase tracking-widest border transition-all",
                    type === 'like' ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-muted-foreground"
                  )}
                >
                  Like
                </button>
                <button
                  onClick={() => setType('need')}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-[9px] uppercase tracking-widest border transition-all",
                    type === 'need' ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-muted-foreground"
                  )}
                >
                  Need
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Product Link</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://..."
              className="rounded-xl border-border bg-transparent h-10"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Personal Note</Label>
            <Textarea 
              id="note" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Size, color preference, or why you want it..."
              className="rounded-xl border-border bg-transparent min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="bg-muted/30 p-6 flex-row justify-end gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-light">Cancel</Button>
          <Button onClick={handleSave} className="rounded-xl px-8 bg-primary hover:bg-primary/90 font-light tracking-wide">Update Wish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}