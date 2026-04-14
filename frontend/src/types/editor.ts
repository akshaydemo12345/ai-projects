export type BlockType =

  | 'navbar' | 'hero' | 'stats' | 'features' | 'how-it-works'

  | 'testimonials' | 'pricing' | 'faq' | 'lead-form' | 'cta-banner'

  | 'text-block' | 'heading-block' | 'image-block' | 'divider' | 'spacer'

  | 'button-block' | 'two-col' | 'footer'

  | 'section' | '1-column' | '3-columns' | 'text' | 'link' | 'image' | 'quote'

  | 'form' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'button' | 'label'

  | 'video' | 'google-map' | 'link-block' | 'countdown'

  | 'custom-data-table' | 'dynamic-fields';



export interface Block {

  id: string;

  type: BlockType;

  content: Record<string, any>;

}



export interface PageMeta {

  title: string;

  description: string;

  keywords: string;

  ogTitle: string;

  ogDesc: string;

  ogImage: string;

  canonical: string;

  robots: string;

}



export interface PageState {

  id: string;

  name: string;

  blocks: Block[];

  meta: PageMeta;

}

