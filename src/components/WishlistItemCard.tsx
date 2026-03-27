"use client";

import React, { useState, useMemo } from 'react';
import { WishlistItem } from '@/components/WishlistPanel';
import { ExternalLink, Trash2, Check, Pencil, Heart, ShoppingBag, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistItemCardProps {
  item: WishlistItem;
  isAdmin: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: () => void;
  fulfillmentCount?: number;
  fulfillmentNames?: string[];
  isFulfilledByMe?: boolean;
}

export default function WishlistItemCard({ 
  item, 
  isAdmin, 
  onToggle, 
  onRemove, 
  onEdit,
  fulfillmentCount = 0,
  fulfillmentNames = [],
  isFulfilledByMe = false
}: WishlistItemCardProps) {
  const [isTicking, setIsTicking] = useState(false);

  const isFulfilled = item.purchased;

  const handleToggle = () => {
    // Admin can always toggle. 
    // Friends can always toggle their own participation, regardless of others.
    setIsTicking(true);
    onToggle();
    setTimeout(() => setIsTicking(false), 400);
  };

  const fulfillmentSummary = useMemo(() => {
    if (fulfillmentNames.length === 0) return null;
    if (fulfillmentNames.length === 1) return `Fulfilled by ${fulfillmentNames[0]}`;
    if (fulfillmentNames.length === 2) return `Fulfilled by ${fulfillmentNames[0]} & ${fulfillmentNames[1]}`;
    return `Fulfilled by ${fulfillmentNames[0]} & ${fulfillmentNames.length - 1} others`;
  }, [fulfillmentNames]);

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-5 md:py-6 border-b border-border hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
        <button 
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 flex-shrink-0 mt-1 md:mt-0",
            isFulfilled 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-transparent hover:border-primary',
            isTicking && 'animate-tick-pop',
            isFulfilledByMe && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          )}
        >
          <Check size={12} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className={cn(
              "text-base md:text-lg font-light transition-all duration-500",
              isFulfilled ? 'text-muted-foreground/60 line-through' : 'text-foreground'
            )}>
              {item.name}
            </span>
            {item.type && (
              <span className="opacity-30 shrink-0" title={item.type === 'like' ? 'Thing I Like' : 'Thing I Need'}>
                {item.type === 'like' ? <Heart size={14} /> : <ShoppingBag size={14} />}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2">
            <span className="text-[8px] md:text-[9px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-md border border-border/50 shrink-0">
              {item.category}
            </span>
            
            {fulfillmentCount > 0 && (
              <span className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-mono text-accent uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded-md border border-accent/20 shrink-0">
                <Users size={10} /> {fulfillmentCount} {fulfillmentCount === 1 ? 'Person' : 'People'}
              </span>
            )}

            {!isAdmin && fulfillmentSummary && (
              <span className="text-[10px] text-muted-foreground font-medium italic">
                {fulfillmentSummary}
              </span>
            )}

            {item.note && (
              <span className="text-[10px] md:text-xs text-muted-foreground/70 italic border-l border-border/50 pl-4 py-0.5 leading-relaxed">
                {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 mt-4 sm:mt-0 pl-10 sm:pl-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="View link"
          >
            <ExternalLink size={18} />
          </a>
        )}
        {isAdmin && (
          <>
            <button 
              onClick={onEdit}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              title="Edit item"
            >
              <Pencil size={18} />
            </button>
            <button 
              onClick={onRemove}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete item"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
