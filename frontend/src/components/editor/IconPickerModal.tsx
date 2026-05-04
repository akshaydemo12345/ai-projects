import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const COMMON_ICONS = [
  'fa-star', 'fa-heart', 'fa-user', 'fa-home', 'fa-search', 'fa-envelope',
  'fa-bell', 'fa-camera', 'fa-check', 'fa-times', 'fa-cog', 'fa-arrow-right',
  'fa-arrow-left', 'fa-arrow-up', 'fa-arrow-down', 'fa-play', 'fa-pause',
  'fa-music', 'fa-video', 'fa-image', 'fa-file', 'fa-folder', 'fa-trash',
  'fa-edit', 'fa-save', 'fa-lock', 'fa-unlock', 'fa-key', 'fa-shield-alt',
  'fa-users', 'fa-user-md', 'fa-stethoscope', 'fa-tooth', 'fa-heartbeat',
  'fa-hospital', 'fa-ambulance', 'fa-phone', 'fa-map-marker-alt', 'fa-globe',
  'fa-laptop', 'fa-mobile-alt', 'fa-tablet-alt', 'fa-desktop', 'fa-cloud',
  'fa-comment', 'fa-comments', 'fa-thumbs-up', 'fa-thumbs-down', 'fa-share',
  'fa-reply', 'fa-calendar', 'fa-clock', 'fa-chart-bar', 'fa-chart-pie',
  'fa-chart-line', 'fa-shopping-cart', 'fa-credit-card', 'fa-wallet', 'fa-money-bill',
  'fa-gift', 'fa-truck', 'fa-plane', 'fa-car', 'fa-bicycle', 'fa-bolt',
  'fa-fire', 'fa-leaf', 'fa-water', 'fa-sun', 'fa-moon', 'fa-star-half-alt',
  'fa-smile', 'fa-frown', 'fa-meh', 'fa-laugh', 'fa-sad-cry', 'fa-angry'
];

interface IconPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIcon: (iconClass: string) => void;
}

export function IconPickerModal({ open, onOpenChange, onSelectIcon }: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = COMMON_ICONS.filter(icon => 
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-1">
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onSelectIcon(icon);
                onOpenChange(false);
              }}
              className="flex flex-col items-center justify-center p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={icon}
            >
              <i className={`fas ${icon} text-xl mb-2 text-slate-700 dark:text-slate-300`}></i>
            </button>
          ))}
          {filteredIcons.length === 0 && (
            <div className="col-span-6 text-center text-muted-foreground py-8">
              No icons found matching "{searchTerm}"
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
