"use client";

import React from 'react';
import { WishlistItem } from '@/components/WishlistPanel';
import { ExternalLink, Trash2, Tag, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
}

export default function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  return (
    <div className="group bg-white p-6 rounded-2xl border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-accent/20 flex flex-col sm:flex-row items-start gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-primary truncate group-hover:text-accent transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.url && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-background rounded-full text-muted-foreground hover:text-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemove(item.id)}
              className="p-2 h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {item.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(item.createdAt, 'MMM d, yyyy')}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-[10px] px-2 py-0 h-5 bg-background text-muted-foreground border-transparent hover:bg-accent/10 hover:text-accent transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}