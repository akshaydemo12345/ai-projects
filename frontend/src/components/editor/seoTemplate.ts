import type { PageState } from '@/types/editor';
import { BLOCK_DEFS } from './blockDefs';

const uid = () => Math.random().toString(36).slice(2, 10);
const dc = (type: string) => BLOCK_DEFS.find((d) => d.type === type)?.defaultContent ?? {};

export const defaultSeoTemplate = (): PageState => ({
  id: uid(),
  name: 'SEO Agency Landing Page',
  meta: {
    title: 'Professional SEO Services | Rank #1 on Google | YourBrand',
    description: 'Award-winning SEO agency helping businesses rank #1 on Google and generate more leads. Get your free SEO audit today.',
    keywords: 'SEO services, search engine optimization, digital marketing, SEO agency, rank on Google',
    ogTitle: 'Professional SEO Services | YourBrand',
    ogDesc: 'Award-winning SEO agency helping businesses rank #1 on Google. Get your free SEO audit.',
    ogImage: '',
    canonical: '',
    robots: 'index, follow',
  },
  blocks: [
    { id: uid(), type: 'navbar', content: dc('navbar') },
    { id: uid(), type: 'hero', content: dc('hero') },
    { id: uid(), type: 'stats', content: dc('stats') },
    { id: uid(), type: 'features', content: dc('features') },
    { id: uid(), type: 'how-it-works', content: dc('how-it-works') },
    { id: uid(), type: 'testimonials', content: dc('testimonials') },
    { id: uid(), type: 'pricing', content: dc('pricing') },
    { id: uid(), type: 'faq', content: dc('faq') },
    { id: uid(), type: 'lead-form', content: dc('lead-form') },
    { id: uid(), type: 'footer', content: dc('footer') },
  ],
});
