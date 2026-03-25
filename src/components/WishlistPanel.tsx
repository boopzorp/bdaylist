"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import WishlistItemCard from '@/components/WishlistItemCard';
import EditItemDialog from '@/components/EditItemDialog';
import { suggestWishlistItemDetails } from '@/ai/flows/suggest-wishlist-item-details';
import { toast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  url?: string;
  note?: string;
  purchased: boolean;
  createdAt: number;
}

export default function WishlistPanel() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wishstream_items_v2');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([
        { id: '1', name: 'Leica M11 Monochrom', url: 'https://leica-camera.com', purchased: false, category: 'Photography', createdAt: Date.now() - 1000000 },
        { id: '2', name: 'Vitra Eames Lounge Chair', url: 'https://vitra.com', purchased: false, category: 'Furniture', createdAt: Date.now() - 2000000 },
        { id: '3', name: 'Kyoto Autumn Trip', url: '', purchased: true, category: 'Travel', createdAt: Date.now() - 3000000 },
      ]);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishstream_items_v2', JSON.stringify(items));
    }
  }, [items, mounted]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const item: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      url: '',
      note: '',
      purchased: false,
      category: newCategory.trim() || 'Misc',
      createdAt: Date.now(),
    };
    
    setItems(prev => [item, ...prev]);
    setNewItemName('');
    setNewCategory('');
  };

  const handleEnhance = async () => {
    if (!newItemName.trim()) return;
    setIsEnhancing(true);
    try {
      const result = await suggestWishlistItemDetails({ title: newItemName });
      if (result && result.suggestedTags.length > 0) {
        setNewCategory(result.suggestedTags[0]);
        toast({ title: "AI Suggestion", description: `Suggested category: ${result.suggestedTags[0]}` });
      }
    } catch (error) {
      console.error(error);
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

  const updateItem = (updatedItem: WishlistItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto p-8 lg:p-16 xl:p-24">
      <header className="mb-16">
        <h2 className="text-4xl lg:text-5xl font-extralight tracking-tighter text-foreground">
          Wishlist.
        </h2>
        <div className="w-12 h-[1px] bg-primary mt-6" />
      </header>

      <form onSubmit={handleAddItem} className="mb-16 relative group">
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="What are you desiring?"
              className="w-full bg-transparent border-b border-border py-3 text-lg font-light placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="w-full sm:w-1/3 relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category"
              className="w-full bg-transparent border-b border-border py-3 text-lg font-light placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button 
              type="button"
              onClick={handleEnhance}
              disabled={isEnhancing || !newItemName.trim()}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={!newItemName.trim()}
            className="flex items-center justify-center h-12 w-12 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 group shrink-0"
          >
            <Plus size={20} className="transition-transform group-hover:rotate-90 duration-300" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              onToggle={() => togglePurchased(item.id)}
              onRemove={() => removeItem(item.id)} 
              onEdit={() => setEditingItem(item)}
            />
          ))
        ) : (
          <div className="py-24 text-center text-muted-foreground font-light">
            Your wishlist is currently empty.
          </div>
        )}
      </div>

      <footer className="mt-32 pt-8 text-xs font-mono text-muted-foreground uppercase tracking-widest text-center border-t border-border">
        {items.filter(i => i.purchased).length} / {items.length} Fulfilled
      </footer>

      {editingItem && (
        <EditItemDialog 
          item={editingItem} 
          open={!!editingItem} 
          onOpenChange={(open) => !open && setEditingItem(null)} 
          onUpdate={updateItem}
        />
      )}
    </div>
  );
}
