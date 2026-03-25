"use client";

import React from 'react';
import { WishlistItem } from '@/components/WishlistPanel';
import { ExternalLink, Trash2, Check } from 'lucide-react';

interface WishlistItemCardProps {
  item: WishlistItem;
  onToggle: () => void;
  onRemove: () => void;
}

export default function WishlistItemCard({ item, onToggle, onRemove }: WishlistItemCardProps) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-neutral-100 hover:border-neutral-300 transition-colors">
      <div className="flex items-center gap-6 flex-1">
        {/* Custom Checkbox */}
        <button 
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0
            ${item.purchased 
              ? 'bg-neutral-900 border-neutral-900 text-white' 
              : 'border-neutral-300 text-transparent hover:border-neutral-500'}`}
        >
          <Check size={12} strokeWidth={3} />
        </button>
        
        <div className="flex flex-col">
          <span className={`text-lg font-light transition-all duration-300 ${item.purchased ? 'text-neutral-300 line-through' : 'text-neutral-800'}`}>
            {item.name}
          </span>
          <span className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            {item.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 sm:mt-0 pl-12 sm:pl-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label="External link"
          >
            <ExternalLink size={16} />
          </a>
        )}
        <button 
          onClick={onRemove}
          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
