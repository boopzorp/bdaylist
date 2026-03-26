
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Sparkles, Loader2, Filter, Heart, ShoppingBag, PartyPopper } from 'lucide-react';
import WishlistItemCard from '@/components/WishlistItemCard';
import EditItemDialog from '@/components/EditItemDialog';
import FriendOnboardingDialog from '@/components/FriendOnboardingDialog';
import { suggestWishlistItemDetails } from '@/ai/flows/suggest-wishlist-item-details';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, where, updateDoc, arrayUnion, setDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
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
  userId: string;
}

interface WishlistPanelProps {
  isAdmin: boolean;
  targetUserId: string | null;
  isProfileCollapsed: boolean;
  onToggleProfile: (collapsed: boolean) => void;
}

export default function WishlistPanel({ isAdmin, targetUserId, isProfileCollapsed, onToggleProfile }: WishlistPanelProps) {
  const { firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const [newItemName, setNewItemName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState<ItemType>('like');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'like' | 'need'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [friendName, setFriendName] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Firestore Queries - SECURITY: Must wait for user to be authenticated to satisfy isSignedIn()
  const itemsRef = useMemoFirebase(() => {
    if (!firestore || !targetUserId || !user) return null;
    return query(collection(firestore, 'userProfiles', targetUserId, 'wishlistItems'), orderBy('createdAt', 'desc'));
  }, [firestore, targetUserId, user]);

  const { data: items } = useCollection<WishlistItem>(itemsRef);

  const profileRef = useMemoFirebase(() => {
    if (!firestore || !targetUserId || !user) return null;
    return doc(firestore, 'userProfiles', targetUserId);
  }, [firestore, targetUserId, user]);

  const { data: profile } = useDoc(profileRef);

  const sharedRef = useMemoFirebase(() => {
    if (!firestore || !targetUserId || !user) return null;
    return query(
      collection(firestore, 'sharedWishlistStatuses'), 
      where('userId', '==', targetUserId)
    );
  }, [firestore, targetUserId, user]);

  const { data: sharedStatuses } = useCollection(sharedRef);

  useEffect(() => {
    if (!isAdmin && targetUserId) {
      const savedFriend = localStorage.getItem(`friend_data_${targetUserId}`);
      if (!savedFriend) {
        setShowOnboarding(true);
      } else {
        setFriendName(JSON.parse(savedFriend).name);
      }
    }

    const handleScroll = () => {
      if (window.innerWidth < 768) {
        if (window.scrollY > 400 && !isProfileCollapsed) {
          onToggleProfile(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin, targetUserId, isProfileCollapsed, onToggleProfile]);

  const categories = useMemo(() => {
    if (!items) return ['all'];
    const cats = Array.from(new Set(items.map(item => item.category).filter(Boolean)));
    return ['all', ...cats.sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items.filter(item => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesTab && matchesCategory;
    });
  }, [items, activeTab, selectedCategory]);

  const formattedBirthday = profile?.birthdate 
    ? format(new Date(profile.birthdate), 'MMM dd').toUpperCase()
    : "OCT 24";

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !firestore || !user) return;
    
    const itemId = Math.random().toString(36).substr(2, 9);
    const itemData = {
      id: itemId,
      userId: user.uid,
      name: newItemName,
      url: '',
      note: '',
      purchased: false,
      type: newType,
      category: newCategory.trim() || 'Misc',
      createdAt: Date.now(),
    };
    
    await setDoc(doc(firestore, 'userProfiles', user.uid, 'wishlistItems', itemId), itemData);
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

  const togglePurchased = async (id: string) => {
    if (!firestore || !targetUserId || !user) return;
    
    const item = items?.find(i => i.id === id);
    if (!item) return;

    if (isAdmin) {
      await updateDoc(doc(firestore, 'userProfiles', targetUserId, 'wishlistItems', id), {
        purchased: !item.purchased
      });
    } else {
      const savedFriend = localStorage.getItem(`friend_data_${targetUserId}`);
      const friendData = savedFriend ? JSON.parse(savedFriend) : { name: friendName, shareName: false };
      
      const sharedDocRef = doc(firestore, 'sharedWishlistStatuses', id);
      
      // We use a Map keyed by user.uid to ensure uniqueness.
      // If the same friend clicks again, it just updates their existing record.
      await setDoc(sharedDocRef, {
        userId: targetUserId,
        itemId: id,
        tickedOff: true,
        fulfillments: {
          [user.uid]: {
            friendName: friendData.shareName ? friendData.name : 'Anonymous',
            shareName: friendData.shareName,
            timestamp: Date.now()
          }
        }
      }, { merge: true });

      toast({
        title: "Ticked Off!",
        description: "Surprise! Fulfillment recorded.",
      });
    }
  };

  const removeItem = async (id: string) => {
    if (!firestore || !user) return;
    await deleteDoc(doc(firestore, 'userProfiles', user.uid, 'wishlistItems', id));
  };

  const updateItem = async (updatedItem: WishlistItem) => {
    if (!firestore || !user) return;
    await setDoc(doc(firestore, 'userProfiles', user.uid, 'wishlistItems', updatedItem.id), updatedItem);
    setEditingItem(null);
  };

  const handleOnboardingComplete = async (data: { name: string; shareName: boolean }) => {
    if (!firestore || !targetUserId) return;
    
    localStorage.setItem(`friend_data_${targetUserId}`, JSON.stringify(data));
    setFriendName(data.name);
    setShowOnboarding(false);

    const guestDocRef = doc(firestore, 'userProfiles', targetUserId, 'guests', 'list');
    await setDoc(guestDocRef, {
      guests: arrayUnion({
        name: data.name,
        shareName: data.shareName,
        timestamp: Date.now()
      })
    }, { merge: true });
  };

  const restoreProfile = () => {
    onToggleProfile(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16 xl:p-24">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md -mx-6 px-6 py-4 mb-8 md:mb-12 md:relative md:bg-transparent md:backdrop-blur-none md:p-0 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tighter text-foreground">
              BddayList.
            </h2>
            <div className="w-10 md:w-12 h-[1px] bg-primary mt-2 md:mt-6 hidden md:block" />
          </div>

          {isProfileCollapsed && (
            <div className="relative md:hidden animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="absolute -top-3 -right-2 text-accent animate-float-slow">
                <Sparkles size={14} />
              </div>
              <div className="absolute -bottom-2 -left-3 text-primary animate-bounce opacity-70">
                <PartyPopper size={12} />
              </div>
              <button 
                onClick={restoreProfile}
                className="bg-card px-4 py-1.5 rounded-full border border-border shadow-sm animate-pulse-ring flex items-center gap-2"
              >
                <span className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground whitespace-nowrap">
                  {formattedBirthday}
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
        <form onSubmit={handleAddItem} className="mb-12 md:mb-20 bg-card/40 p-5 md:p-6 rounded-2xl border border-border/50 backdrop-blur-sm relative z-10 shadow-sm">
          <div className="flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Add a new birthday desire..."
                  className="w-full bg-transparent border-b border-border py-2 md:py-3 text-base md:text-lg font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="w-full sm:w-1/3 relative">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Category"
                  className="w-full bg-transparent border-b border-border py-2 md:py-3 text-base md:text-lg font-light placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
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
                <span className="xs:hidden ml-2 text-[10px] uppercase tracking-widest font-medium">Add to Stream</span>
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-1 md:space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const status = sharedStatuses?.find(s => s.itemId === item.id);
            // Handle both legacy array and new Map structure for backward compatibility
            const rawFulfillments = status?.fulfillments || [];
            const fulfillments: any[] = Array.isArray(rawFulfillments) 
              ? rawFulfillments 
              : Object.values(rawFulfillments);
              
            const isFulfilled = isAdmin ? item.purchased : fulfillments.length > 0;

            return (
              <WishlistItemCard 
                key={item.id} 
                item={{...item, purchased: isFulfilled}} 
                isAdmin={isAdmin}
                onToggle={() => togglePurchased(item.id)}
                onRemove={() => removeItem(item.id)} 
                onEdit={() => setEditingItem(item)}
                fulfillmentCount={fulfillments.length}
                fulfillmentNames={isAdmin ? [] : fulfillments.filter(f => f.shareName).map(f => f.friendName)}
              />
            );
          })
        ) : (
          <div className="py-16 md:py-24 text-center text-muted-foreground font-light italic text-sm">
            {items ? 'No items in this stream yet.' : (isUserLoading || (!isAdmin && !user)) ? 'Identifying Guest...' : 'Loading BddayList...'}
          </div>
        )}
      </div>

      <FriendOnboardingDialog 
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

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
