"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import WishlistItemCard from '@/components/WishlistItemCard';
import { suggestWishlistItemDetails } from '@/ai/flows/suggest-wishlist-item-details';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  url?: string;
  purchased: boolean;
  createdAt: number;
}

export default function WishlistPanel() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wishstream_items_refined');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      // Default items if empty
      setItems([
        { id: '1', name: 'Leica M11 Monochrom', url: '#', purchased: false, category: 'Photography', createdAt: Date.now() - 1000000 },
        { id: '2', name: 'Vitra Eames Lounge Chair', url: '#', purchased: false, category: 'Furniture', createdAt: Date.now() - 2000000 },
        { id: '3', name: 'Kyoto Autumn Trip', url: '#', purchased: true, category: 'Travel', createdAt: Date.now() - 3000000 },
      ]);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishstream_items_refined', JSON.stringify(items));
    }
  }, [items, mounted]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    const item: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem,
      url: '#',
      purchased: false,
      category: newCategory.trim() || 'Misc',
      createdAt: Date.now(),
    };
    
    setItems(prev => [item, ...prev]);
    setNewItem('');
    setNewCategory('');
  };

  const handleEnhance = async () => {
    if (!newItem.trim()) {
      toast({
        title: "Missing Info",
        description: "Please enter an item name to enhance.",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const result = await suggestWishlistItemDetails({
        title: newItem,
      });

      if (result && result.suggestedTags.length > 0) {
        setNewCategory(result.suggestedTags[0]);
        toast({
          title: "AI Suggestion",
          description: `Suggested category: ${result.suggestedTags[0]}`
        });
      }
    } catch (error) {
      console.error("Enhancement failed:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const togglePurchased = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 lg:p-16 xl:p-24">
      <header className="mb-16">
        <h2 className="text-4xl lg:text-5xl font-extralight tracking-tighter text-neutral-900">
          Wishlist.
        </h2>
        <div className="w-12 h-[1px] bg-neutral-900 mt-6" />
      </header>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="mb-16 relative group">
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="What are you desiring?"
              className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg font-light placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
          <div className="w-full sm:w-1/3 relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="w-full bg-transparent border-b border-neutral-200 py-3 text-lg font-light placeholder:text-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
            />
            <button 
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing || !newItem.trim()}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-neutral-300 hover:text-neutral-900 disabled:opacity-30 transition-colors"
              title="AI Suggest Category"
            >
              {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={!newItem.trim()}
            className="flex items-center justify-center h-12 w-12 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-900 group shrink-0"
          >
            <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              onToggle={() => togglePurchased(item.id)}
              onRemove={() => removeItem(item.id)} 
            />
          ))
        ) : (
          <div className="py-24 text-center text-neutral-400 font-light">
            Your wishlist is currently empty.
          </div>
        )}
      </div>

      <footer className="mt-32 pt-8 text-xs font-mono text-neutral-300 uppercase tracking-widest text-center border-t border-neutral-100">
        {items.filter(i => i.purchased).length} / {items.length} Fulfilled
      </footer>
    </div>
  );
}
