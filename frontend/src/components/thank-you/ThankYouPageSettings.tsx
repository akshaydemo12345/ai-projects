import { ThankYouConfigForm } from './ThankYouConfigForm';

/**
 * ThankYouPageSettings - Integration Component
 * 
 * This is the main integration component that can be easily embedded into any page editor/dashboard.
 * It provides a complete Thank You page configuration interface with:
 * - Visual layout selection
 * - Content customization
 * - Tracking configuration
 * - Branding options
 * - Live preview
 * 
 * Usage:
 * ```tsx
 * import { ThankYouPageSettings } from '@/components/thank-you/ThankYouPageSettings';
 * 
 * <ThankYouPageSettings 
 *   pageId={page._id} 
 *   industry={page.industry} 
 *   onSave={() => {
 *     // Refresh page data or show success message
 *   }}
 * />
 * ```
 */
interface ThankYouPageSettingsProps {
  pageId: string;
  industry?: string;
  onSave?: () => void;
}

export const ThankYouPageSettings = ({ pageId, industry, onSave }: ThankYouPageSettingsProps) => {
  return (
    <div className="thank-you-page-settings">
      <ThankYouConfigForm
        pageId={pageId}
        industry={industry}
        onSave={onSave}
      />
    </div>
  );
};

export default ThankYouPageSettings;
