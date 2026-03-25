"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, SlidersHorizontal, PackageOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import WishlistItemCard from '@/components/WishlistItemCard';
import AddItemDialog from '@/components/AddItemDialog';
import { Badge } from '@/components/ui/badge';

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  url?: string;
  tags: string[];
  createdAt: number;
}

export default function WishlistPanel() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wishstream_items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishstream_items', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 flex flex-col h-full">
      <header className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-headline font-bold text-primary">Your Wishlist</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-medium">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </Badge>
          </div>
        </div>
        <Button onClick={() => setIsAdding(true)} className="rounded-full px-6 bg-accent hover:bg-accent/90">
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </Button>
      </header>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search items or tags..." 
            className="pl-10 h-12 bg-white border-border/50 rounded-xl focus:ring-accent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border/50">
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-12 pr-2 custom-scrollbar">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <WishlistItemCard key={item.id} item={item} onRemove={removeItem} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <PackageOpen className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">No items found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">
                {searchQuery ? "Try a different search term or clear the filter." : "Your wishlist is currently empty. Start adding some wishes!"}
              </p>
            </div>
            {!searchQuery && (
              <Button onClick={() => setIsAdding(true)} variant="link" className="text-accent">
                Add your first item
              </Button>
            )}
          </div>
        )}
      </div>

      <AddItemDialog 
        open={isAdding} 
        onOpenChange={setIsAdding} 
        onAdd={addItem} 
      />
    </div>
  );
}