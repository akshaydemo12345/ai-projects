const fs = require('fs');
const path = './frontend/src/templates/travel/templates03.ts';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80': '/assets/templates/travel/templates03/hero.png',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80': '/assets/templates/travel/templates03/traveler-man.png',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80': '/assets/templates/travel/templates03/traveler-woman.png',
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80': '/assets/templates/travel/templates03/dest-venice.jpg',
  'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=600&q=80': '/assets/templates/travel/templates03/dest-iceland.jpg',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80': '/assets/templates/travel/templates03/dest-moab.jpg',
  'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=600&q=80': '/assets/templates/travel/templates03/dest-arizona.jpg',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80': '/assets/templates/travel/templates03/patagonia.png',
  'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=400&q=80': '/assets/templates/travel/templates03/card-morocco.jpg',
  'https://images.unsplash.com/photo-1619856699906-09e1f4ef710c?auto=format&fit=crop&w=400&q=80': '/assets/templates/travel/templates03/card-denver.jpg',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop': '/assets/templates/travel/templates03/designer.png',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop': '/assets/templates/travel/templates03/photographer.png',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80': '/assets/templates/travel/templates03/spa.png'
};

for (const [url, replacement] of Object.entries(replacements)) {
  // Using split/join to replace all occurrences without worrying about regex escaping
  content = content.split(url).join(replacement);
}

fs.writeFileSync(path, content);
console.log('Successfully replaced travel03 images.');
