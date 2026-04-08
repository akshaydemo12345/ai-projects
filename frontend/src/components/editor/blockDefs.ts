import type { BlockType } from '@/types/editor';

export interface BlockDef {
  type: BlockType;
  label: string;
  category: 'Navigation' | 'Layout' | 'Content' | 'Text' | 'Media' | 'Conversion';
  emoji: string;
  defaultContent: Record<string, any>;
}

export const BLOCK_DEFS: BlockDef[] = [
  {
    type: 'navbar', label: 'Navigation Bar', category: 'Navigation', emoji: '☰',
    defaultContent: { logo: 'YourBrand', links: ['Services', 'About', 'Case Studies', 'Blog'], cta: 'Get Free Quote' },
  },
  {
    type: 'hero', label: 'Hero + Lead Form', category: 'Layout', emoji: '🚀',
    defaultContent: {
      badge: '🏆 Award-Winning Agency',
      heading: 'Dominate Search Rankings & Drive Real Business Growth',
      subtext: 'Data-driven SEO strategies that have helped 500+ businesses rank #1 on Google and generate millions in revenue.',
      trust: ['500+ Happy Clients', 'Guaranteed Results', 'No Long-Term Contracts'],
      formTitle: 'Get Your Free SEO Audit',
      formFields: ['Full Name', 'Email Address', 'Phone Number', 'Company Website'],
      formButton: "Get Free Analysis — It's Free!",
      formDisclaimer: 'We process your data per our Privacy Policy. No spam, ever.',
    },
  },
  {
    type: 'stats', label: 'Stats Bar', category: 'Content', emoji: '📊',
    defaultContent: { stats: [{ value: '500+', label: 'Happy Clients' }, { value: '95%', label: 'Client Retention' }, { value: '10M+', label: 'Keywords Ranked' }, { value: '312%', label: 'Avg Traffic Growth' }] },
  },
  {
    type: 'features', label: 'Features Grid', category: 'Content', emoji: '⭐',
    defaultContent: {
      heading: 'Why Choose Us', subtext: 'We deliver real results, not just promises.',
      features: [
        { icon: '🎯', title: 'Data-Driven Strategy', desc: 'Every decision backed by data and analytics for maximum ROI.' },
        { icon: '⚡', title: 'Technical SEO', desc: 'We fix the issues holding your site back from ranking.' },
        { icon: '✍️', title: 'Content That Converts', desc: 'Compelling content that ranks and turns visitors into leads.' },
        { icon: '🔗', title: 'Authority Building', desc: 'High-quality backlinks from authoritative sources.' },
        { icon: '📍', title: 'Local SEO', desc: 'Dominate local search and capture customers in your city.' },
        { icon: '📈', title: 'Transparent Reporting', desc: 'Monthly reports so you always know what we are doing.' },
      ],
    },
  },
  {
    type: 'how-it-works', label: 'How It Works', category: 'Content', emoji: '📋',
    defaultContent: {
      heading: 'Our Proven 4-Step Process', subtext: 'A systematic approach that delivers consistent results.',
      steps: [
        { num: '01', title: 'Free SEO Audit', desc: 'We analyze your website, competitors, and target keywords to find growth opportunities.' },
        { num: '02', title: 'Custom Strategy', desc: 'Our experts build a tailored SEO plan aligned with your business goals and budget.' },
        { num: '03', title: 'Execute & Optimize', desc: 'We implement the strategy, monitor performance, and optimize for better results.' },
        { num: '04', title: 'Scale Your Growth', desc: 'As results compound, we scale successful campaigns to maximize your ROI.' },
      ],
    },
  },
  {
    type: 'testimonials', label: 'Testimonials', category: 'Conversion', emoji: '💬',
    defaultContent: {
      heading: 'What Our Clients Say', subtext: "Don't take our word for it.",
      testimonials: [
        { name: 'Sarah Johnson', title: 'CEO, TechStartup Inc.', text: 'Their SEO strategy took us from page 5 to #1 in just 4 months. Our organic traffic increased by 380%. Absolutely incredible.', stars: 5 },
        { name: 'Michael Chen', title: 'Marketing Director, E-Commerce Pro', text: 'We saw a 215% increase in qualified leads within 6 months. Professional, transparent, and delivers on promises.', stars: 5 },
        { name: 'Emily Rodriguez', title: 'Founder, Local Services Co.', text: "We're now #1 for all our target keywords in our city. Revenue doubled in a year. Best investment we've made.", stars: 5 },
      ],
    },
  },
  {
    type: 'pricing', label: 'Pricing Plans', category: 'Conversion', emoji: '💰',
    defaultContent: {
      heading: 'Transparent, Results-Driven Pricing', subtext: 'Choose the plan that fits your business.',
      plans: [
        { name: 'Starter', price: '$499', period: '/month', desc: 'Perfect for small businesses.', features: ['Up to 15 Keywords', 'Monthly Reporting', 'On-Page SEO', 'Technical Audit', '2 Blog Posts/Month', 'Email Support'], cta: 'Get Started', highlighted: false },
        { name: 'Growth', price: '$999', period: '/month', desc: 'For growing businesses ready to dominate.', features: ['Up to 40 Keywords', 'Weekly Reporting', 'Advanced Link Building', 'Content Strategy', '6 Blog Posts/Month', 'Priority Support', 'Competitor Analysis'], cta: 'Start Growing', highlighted: true },
        { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large businesses needing full-service.', features: ['Unlimited Keywords', 'Daily Monitoring', 'Custom Link Building', 'Dedicated Team', 'Daily Content', '24/7 Support', 'White-Label Reports'], cta: 'Contact Us', highlighted: false },
      ],
    },
  },
  {
    type: 'faq', label: 'FAQ Accordion', category: 'Content', emoji: '❓',
    defaultContent: {
      heading: 'Frequently Asked Questions', subtext: 'Have questions? We have answers.',
      faqs: [
        { q: 'How long does SEO take to show results?', a: 'SEO typically shows meaningful results within 3-6 months depending on your industry, competition, and website state.' },
        { q: 'Do you guarantee #1 rankings?', a: 'No ethical SEO agency can guarantee specific rankings. We guarantee our effort, process, and transparency. Our track record speaks for itself.' },
        { q: 'What makes your SEO different?', a: 'We focus on business outcomes — leads, conversions, revenue — not just traffic and rankings. Our strategies are white-hat and built for long-term growth.' },
        { q: 'Can I cancel anytime?', a: "Yes. We work month-to-month with no long-term contracts. We earn your business every month." },
        { q: 'Do you work with my industry?', a: 'We work across all industries: eCommerce, SaaS, local services, healthcare, legal, real estate, and more.' },
      ],
    },
  },
  {
    type: 'lead-form', label: 'Lead Capture Form', category: 'Conversion', emoji: '📝',
    defaultContent: {
      heading: 'Ready to Grow Your Business?', subtext: 'Schedule your free 30-minute strategy call with our SEO experts today.',
      fields: [
        { label: 'Full Name', type: 'text', required: true }, { label: 'Email Address', type: 'email', required: true },
        { label: 'Phone Number', type: 'tel', required: false }, { label: 'Company Name', type: 'text', required: false },
        { label: 'Website URL', type: 'url', required: false },
        { label: 'Monthly Budget', type: 'select', options: ['Under $500', '$500–$1000', '$1000–$2000', '$2000+'], required: true },
        { label: 'Tell us about your goals', type: 'textarea', required: false },
      ],
      button: 'Schedule My Free Strategy Call',
      disclaimer: "By submitting, you agree to our Privacy Policy. We'll never share your info.",
    },
  },
  {
    type: 'cta-banner', label: 'CTA Banner', category: 'Conversion', emoji: '📢',
    defaultContent: { heading: 'Ready to Dominate Search Rankings?', subtext: 'Join 500+ businesses already growing. Get your free audit today.', cta: 'Get Your Free SEO Audit', secondary: 'Learn More' },
  },
  {
    type: 'text-block', label: 'Text Block', category: 'Text', emoji: '¶',
    defaultContent: { text: 'Write your content here. This flexible text block supports multiple paragraphs of rich content.', align: 'left' },
  },
  {
    type: 'heading-block', label: 'Section Heading', category: 'Text', emoji: 'H',
    defaultContent: { heading: 'Section Title', subtext: 'A brief description of this section', align: 'center' },
  },
  {
    type: 'image-block', label: 'Image', category: 'Media', emoji: '🖼',
    defaultContent: { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', alt: 'Section image', caption: '', rounded: true },
  },
  {
    type: 'two-col', label: 'Two Columns', category: 'Layout', emoji: '⬜⬜',
    defaultContent: { left: 'Left column content. Add your text here.', right: 'Right column content. Add your text here.' },
  },
  {
    type: 'button-block', label: 'Button', category: 'Conversion', emoji: '🔘',
    defaultContent: { text: 'Click Here', href: '#', style: 'primary', align: 'center' },
  },
  {
    type: 'divider', label: 'Divider', category: 'Layout', emoji: '—',
    defaultContent: { color: '#e2e8f0', margin: 40 },
  },
  {
    type: 'spacer', label: 'Spacer', category: 'Layout', emoji: '⬜',
    defaultContent: { height: 60 },
  },
  {
    type: 'footer', label: 'Footer', category: 'Navigation', emoji: '🔻',
    defaultContent: {
      logo: 'YourBrand', tagline: 'Helping businesses grow through data-driven SEO.',
      columns: [
        { title: 'Services', links: ['SEO Audit', 'On-Page SEO', 'Link Building', 'Content Marketing', 'Local SEO'] },
        { title: 'Company', links: ['About', 'Team', 'Case Studies', 'Blog', 'Careers'] },
        { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
      ],
      social: ['Twitter', 'LinkedIn', 'Facebook', 'Instagram'],
      copyright: '© 2025 YourBrand. All rights reserved.',
    },
  },
];

export const getBlockDef = (type: string): BlockDef | undefined =>
  BLOCK_DEFS.find((d) => d.type === type);
