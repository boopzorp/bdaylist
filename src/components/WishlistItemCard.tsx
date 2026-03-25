
"use client";

import React, { useState } from 'react';
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
}

export default function WishlistItemCard({ 
  item, 
  isAdmin, 
  onToggle, 
  onRemove, 
  onEdit,
  fulfillmentCount = 0,
  fulfillmentNames = []
}: WishlistItemCardProps) {
  const [isTicking, setIsTicking] = useState(false);

  const handleToggle = () => {
    setIsTicking(true);
    onToggle();
    setTimeout(() => setIsTicking(false), 400);
  };

  const isFulfilled = item.purchased;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 md:py-6 border-b border-border hover:border-primary/30 transition-colors">
      <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
        <button 
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5 md:mt-0",
            isFulfilled 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-transparent hover:border-primary',
            isTicking && 'animate-tick-pop',
            !isAdmin && isFulfilled && 'cursor-default opacity-80'
          )}
        >
          <Check size={12} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className={cn(
              "text-base md:text-lg font-light transition-all duration-300 truncate",
              isFulfilled ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
              {item.name}
            </span>
            {item.type && (
              <span className="opacity-40 shrink-0" title={item.type === 'like' ? 'Thing I Like' : 'Thing I Need'}>
                {item.type === 'like' ? <Heart size={14} /> : <ShoppingBag size={14} />}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[8px] md:text-[9px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/50 px-1.5 md:px-2 py-0.5 rounded-md border border-border/50 shrink-0">
              {item.category}
            </span>
            {fulfillmentCount > 0 && (
              <span className="flex items-center gap-1.5 text-[8px] md:text-[9px] font-mono text-accent uppercase tracking-widest bg-accent/10 px-1.5 py-0.5 rounded-md border border-accent/20">
                <Users size={10} /> {fulfillmentCount} {fulfillmentCount === 1 ? 'Person' : 'People'}
              </span>
            )}
            {fulfillmentNames.length > 0 && (
              <span className="text-[9px] text-muted-foreground italic truncate max-w-[150px]">
                {fulfillmentNames.join(', ')}
              </span>
            )}
            {item.note && (
              <span className="text-[9px] md:text-[10px] text-muted-foreground italic truncate max-w-[150px] md:max-w-[200px]">
                {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 mt-3 sm:mt-0 pl-10 sm:pl-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="View link"
          >
            <ExternalLink size={16} />
          </a>
        )}
        {isAdmin && (
          <>
            <button 
              onClick={onEdit}
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              title="Edit item"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={onRemove}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Delete item"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
