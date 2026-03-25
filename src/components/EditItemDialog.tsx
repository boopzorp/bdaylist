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
import { WishlistItem } from '@/components/WishlistPanel';

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
  const [note, setNote] = useState(item.note || '');

  const handleSave = () => {
    onUpdate({
      ...item,
      name,
      url,
      category,
      note,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-tight">Edit Wish</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">Item Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="rounded-xl border-border bg-transparent focus:ring-primary h-12 text-lg font-light"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category" className="text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
            <Input 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="rounded-xl border-border bg-transparent h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-xs uppercase tracking-widest text-muted-foreground">Product Link</Label>
            <Input 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder="https://..."
              className="rounded-xl border-border bg-transparent h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note" className="text-xs uppercase tracking-widest text-muted-foreground">Personal Note</Label>
            <Textarea 
              id="note" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="Size, color preference, or why you want it..."
              className="rounded-xl border-border bg-transparent min-h-[100px] resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
          <Button onClick={handleSave} className="rounded-xl px-8 bg-primary hover:bg-primary/90">Update Wish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
