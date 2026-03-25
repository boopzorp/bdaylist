"use client";

import React from 'react';
import { WishlistItem } from '@/components/WishlistPanel';
import { ExternalLink, Trash2, Check, Pencil } from 'lucide-react';

interface WishlistItemCardProps {
  item: WishlistItem;
  onToggle: () => void;
  onRemove: () => void;
  onEdit: () => void;
}

export default function WishlistItemCard({ item, onToggle, onRemove, onEdit }: WishlistItemCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-border hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${item.purchased 
              ? 'bg-primary border-primary text-primary-foreground' 
              : 'border-border text-transparent hover:border-primary'}`}
        >
          <Check size={12} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col">
          <span className={`text-lg font-light transition-all duration-300 ${item.purchased ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {item.name}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">
              {item.category}
            </span>
            {item.note && (
              <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">
                "{item.note}"
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
      </div>
    </div>
  );
}
