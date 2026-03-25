"use client";

import React, { useState } from 'react';
import { WishlistItem } from '@/components/WishlistPanel';
import { ExternalLink, Trash2, Check, Pencil, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WishlistItemCardProps {
  item: WishlistItem;
  isAdmin: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: () => void;
}

export default function WishlistItemCard({ item, isAdmin, onToggle, onRemove, onEdit }: WishlistItemCardProps) {
  const [isTicking, setIsTicking] = useState(false);

  const handleToggle = () => {
    if (!isAdmin) return;
    setIsTicking(true);
    onToggle();
    setTimeout(() => setIsTicking(false), 400);
  };

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={handleToggle}
          disabled={!isAdmin}
          className={cn(
            "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0",
            item.purchased 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-transparent hover:border-primary',
            isTicking && 'animate-tick-pop',
            !isAdmin && 'cursor-default opacity-80'
          )}
        >
          <Check size={12} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-lg font-light transition-all duration-300",
              item.purchased ? 'text-muted-foreground line-through' : 'text-foreground'
            )}>
              {item.name}
            </span>
            {item.type && (
              <span className="opacity-40" title={item.type === 'like' ? 'Thing I Like' : 'Thing I Need'}>
                {item.type === 'like' ? <Heart size={14} /> : <ShoppingBag size={14} />}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
              {item.category}
            </span>
            {item.note && (
              <span className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">
                {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 sm:mt-0 pl-12 sm:pl-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
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