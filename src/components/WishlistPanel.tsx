"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Sparkles, Loader2, Filter, Heart, ShoppingBag, PartyPopper } from 'lucide-react';
import WishlistItemCard from '@/components/WishlistItemCard';
import EditItemDialog from '@/components/EditItemDialog';
import { suggestWishlistItemDetails } from '@/ai/flows/suggest-wishlist-item-details';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ItemType = 'like' | 'need';

export interface WishlistItem {
  id: string;
  name: string;
  category: string;
  type: ItemType;
  url?: string;
  note?: string;
  purchased: boolean;
  createdAt: number;
}

interface WishlistPanelProps {
  isAdmin: boolean;
}

export default function WishlistPanel({ isAdmin }: WishlistPanelProps) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState<ItemType>('like');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'all' | 'like' | 'need'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const saved = localStorage.getItem('wishstream_items_v3');
    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      setItems([
        { id: '1', name: 'Leica M11 Monochrom', url: 'https://leica-camera.com', purchased: false, category: 'Photography', type: 'like', createdAt: Date.now() - 1000000 },
        { id: '2', name: 'Vitra Eames Lounge Chair', url: 'https://vitra.com', purchased: false, category: 'Furniture', type: 'need', createdAt: Date.now() - 2000000 },
        { id: '3', name: 'Kyoto Autumn Trip', url: '', purchased: true, category: 'Travel', type: 'like', createdAt: Date.now() - 3000000 },
      ]);
    }
    setMounted(true);

    const handleScroll = () => {
      // Threshold for mobile scroll detection (sidebar height roughly)
      if (window.innerWidth < 768) {
        setShowFloatingDate(window.scrollY > 300);
      } else {
        setShowFloatingDate(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishstream_items_v3', JSON.stringify(items));
    }
  }, [items, mounted]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map(item => item.category)));
    return ['all', ...cats.sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesTab && matchesCategory;
    });
  }, [items, activeTab, selectedCategory]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const item: WishlistItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      url: '',
      note: '',
      purchased: false,
      type: newType,
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
    if (!isAdmin) return;
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
    <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16 xl:p-24">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tighter text-foreground">
              Wishlist.
            </h2>
            <div className="w-10 md:w-12 h-[1px] bg-primary mt-4 md:mt-6" />
          </div>

          {/* Sticky Mobile Date Pill */}
          {showFloatingDate && (
            <div className="relative md:hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="absolute -top-3 -right-2 text-accent animate-float-slow">
                <Sparkles size={14} />
              </div>
              <div className="absolute -bottom-2 -left-3 text-primary animate-bounce opacity-70">
                <PartyPopper size={12} />
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-muted/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/40 shadow-sm animate-pulse-ring flex items-center gap-2"
              >
                <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground whitespace-nowrap">
                  Oct 24
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto relative z-20">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="bg-muted/50 border border-border h-9 md:h-10 p-1 w-full flex">
              <TabsTrigger value="all" className="flex-1 text-[9px] md:text-[10px] uppercase tracking-widest px-2 md:px-4">All</TabsTrigger>
              <TabsTrigger value="like" className="flex-1 text-[9px] md:text-[10px] uppercase tracking-widest px-2 md:px-4 gap-1.5">
                <Heart size={10} className="hidden xs:inline" /> Likes
              </TabsTrigger>
              <TabsTrigger value="need" className="flex-1 text-[9px] md:text-[10px] uppercase tracking-widest px-2 md:px-4 gap-1.5">
                <ShoppingBag size={10} className="hidden xs:inline" /> Needs
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px] h-9 text-[9px] md:text-[10px] uppercase tracking-widest bg-background border-border shadow-sm">
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent className="z-[100] bg-popover">
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-[10px] uppercase tracking-widest">
                  {cat === 'all' ? 'All Categories' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {isAdmin && (
        <form onSubmit={handleAddItem} className="mb-12 md:mb-20 bg-card/40 p-5 md:p-6 rounded-2xl border border-border/50 backdrop-blur-sm relative z-10">
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="What are you desiring?"
                  className="w-full bg-transparent border-b border-border py-2 md:py-3 text-base md:text-lg font-light placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="w-full sm:w-1/3 relative">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full bg-transparent border-b border-border py-2 md:py-3 text-base md:text-lg font-light placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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
            </div>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('like')}
                  className={cn(
                    "flex-1 xs:flex-none px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest border transition-all duration-300",
                    newType === 'like' 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                  )}
                >
                  Thing I Like
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('need')}
                  className={cn(
                    "flex-1 xs:flex-none px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest border transition-all duration-300",
                    newType === 'need' 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                  )}
                >
                  Thing I Need
                </button>
              </div>

              <button 
                type="submit"
                disabled={!newItemName.trim()}
                className="flex items-center justify-center h-10 w-full xs:w-10 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 group shrink-0"
              >
                <Plus size={18} className="transition-transform group-hover:rotate-90 duration-300" />
                <span className="xs:hidden ml-2 text-[10px] uppercase tracking-widest font-medium">Add Wish</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-1 md:space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              isAdmin={isAdmin}
              onToggle={() => togglePurchased(item.id)}
              onRemove={() => removeItem(item.id)} 
              onEdit={() => setEditingItem(item)}
            />
          ))
        ) : (
          <div className="py-16 md:py-24 text-center text-muted-foreground font-light italic text-sm">
            No items match your current filter.
          </div>
        )}
      </div>

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
