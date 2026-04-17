import { useState, useEffect } from 'react';
import { thankYouApi, ThankYouConfig, ThankYouLayout } from '@/services/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye } from 'lucide-react';
import { ThankYouLayoutSelector } from './ThankYouLayoutSelector';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ThankYouConfigFormProps {
  pageId: string;
  industry?: string;
  onSave?: () => void;
}

export const ThankYouConfigForm = ({ pageId, industry, onSave }: ThankYouConfigFormProps) => {
  const [config, setConfig] = useState<ThankYouConfig>({
    layout: 'default',
    content: {},
    tracking: {},
    branding: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [layouts, setLayouts] = useState<ThankYouLayout[]>([]);

  useEffect(() => {
    loadConfig();
    loadLayouts();
  }, [pageId]);

  const loadLayouts = async () => {
    try {
      const data = await thankYouApi.getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Error loading layouts:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const data = await thankYouApi.getConfig(pageId);
      setConfig(data.config || {
        layout: 'default',
        content: {},
        tracking: {},
        branding: {},
      });
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await thankYouApi.updateConfig(pageId, config);
      onSave?.();
    } catch (error) {
      console.error('Error saving config:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLayoutChange = (layoutId: string) => {
    const selectedLayout = layouts.find(l => l.id === layoutId);
    if (selectedLayout) {
      // Auto-populate content from layout defaults if content is empty
      const newContent = {
        heading: config.content.heading || selectedLayout.defaultContent.heading,
        subheading: config.content.subheading || selectedLayout.defaultContent.subheading,
        ctaText: config.content.ctaText || selectedLayout.defaultContent.ctaText,
        ctaUrl: config.content.ctaUrl || selectedLayout.defaultContent.ctaUrl,
        phoneNumber: config.content.phoneNumber || selectedLayout.defaultContent.phoneNumber,
        offerText: config.content.offerText || selectedLayout.defaultContent.offerText,
        customMessage: config.content.customMessage || selectedLayout.defaultContent.customMessage,
      };

      setConfig({
        ...config,
        layout: layoutId,
        content: newContent,
        branding: {
          primaryColor: config.branding.primaryColor || selectedLayout.theme.primaryColor,
          secondaryColor: config.branding.secondaryColor || selectedLayout.theme.secondaryColor,
          logoUrl: config.branding.logoUrl,
        },
      });
    }
  };

  const resetToLayoutDefaults = () => {
    const selectedLayout = layouts.find(l => l.id === config.layout);
    if (selectedLayout) {
      setConfig({
        ...config,
        content: { ...selectedLayout.defaultContent },
        branding: {
          primaryColor: selectedLayout.theme.primaryColor,
          secondaryColor: selectedLayout.theme.secondaryColor,
          logoUrl: config.branding.logoUrl,
        },
      });
    }
  };

  const handlePreview = async () => {
    try {
      const html = await thankYouApi.preview({
        layout: config.layout,
        content: config.content,
        branding: config.branding,
      });
      setPreviewHtml(html);
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Thank You Page Configuration</h3>
          <p className="text-sm text-gray-600">Customize the Thank You page for this landing page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Layout</CardTitle>
              <CardDescription>
                Choose a layout based on your industry. The layout will determine the design and default messaging.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ThankYouLayoutSelector
                  selectedLayout={config.layout}
                  onLayoutSelect={handleLayoutChange}
                  industry={industry}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToLayoutDefaults}
                  className="w-full"
                >
                  Reset to Layout Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Customization</CardTitle>
              <CardDescription>
                Customize the messaging on your Thank You page. Content auto-populates from your selected layout's defaults. 
                Leave fields empty to use layout defaults, or customize as needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={config.content.heading || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, heading: e.target.value },
                    })
                  }
                  placeholder="Thank You!"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subheading">Subheading</Label>
                <Textarea
                  id="subheading"
                  value={config.content.subheading || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, subheading: e.target.value },
                    })
                  }
                  placeholder="We have received your request and will contact you soon."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">CTA Button Text</Label>
                <Input
                  id="ctaText"
                  value={config.content.ctaText || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, ctaText: e.target.value },
                    })
                  }
                  placeholder="Return to Website"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaUrl">CTA Button URL</Label>
                <Input
                  id="ctaUrl"
                  value={config.content.ctaUrl || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, ctaUrl: e.target.value },
                    })
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
                <Input
                  id="phoneNumber"
                  value={config.content.phoneNumber || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, phoneNumber: e.target.value },
                    })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerText">Offer Text (Optional)</Label>
                <Input
                  id="offerText"
                  value={config.content.offerText || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, offerText: e.target.value },
                    })
                  }
                  placeholder="Get 10% off your first service"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  value={config.content.customMessage || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      content: { ...config.content, customMessage: e.target.value },
                    })
                  }
                  placeholder="Additional custom message..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Configuration</CardTitle>
              <CardDescription>
                Configure tracking scripts for conversion tracking. These will fire after form submission.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ga4MeasurementId">GA4 Measurement ID</Label>
                <Input
                  id="ga4MeasurementId"
                  value={config.tracking.ga4MeasurementId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, ga4MeasurementId: e.target.value },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ga4EventName">GA4 Event Name</Label>
                <Input
                  id="ga4EventName"
                  value={config.tracking.ga4EventName || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, ga4EventName: e.target.value },
                    })
                  }
                  placeholder="lead_submission"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleAdsConversionId">Google Ads Conversion ID</Label>
                <Input
                  id="googleAdsConversionId"
                  value={config.tracking.googleAdsConversionId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, googleAdsConversionId: e.target.value },
                    })
                  }
                  placeholder="AW-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleAdsLabel">Google Ads Label</Label>
                <Input
                  id="googleAdsLabel"
                  value={config.tracking.googleAdsLabel || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, googleAdsLabel: e.target.value },
                    })
                  }
                  placeholder="XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
                <Input
                  id="metaPixelId"
                  value={config.tracking.metaPixelId || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, metaPixelId: e.target.value },
                    })
                  }
                  placeholder="XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaEventName">Meta Event Name</Label>
                <Input
                  id="metaEventName"
                  value={config.tracking.metaEventName || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      tracking: { ...config.tracking, metaEventName: e.target.value },
                    })
                  }
                  placeholder="Lead"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize colors and logo for the Thank You page. Leave empty to use page defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={config.branding.logoUrl || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      branding: { ...config.branding, logoUrl: e.target.value },
                    })
                  }
                  placeholder="https://yourwebsite.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={config.branding.primaryColor || '#7c3aed'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        branding: { ...config.branding, primaryColor: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.branding.primaryColor || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        branding: { ...config.branding, primaryColor: e.target.value },
                      })
                    }
                    placeholder="#7c3aed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={config.branding.secondaryColor || '#6366f1'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        branding: { ...config.branding, secondaryColor: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={config.branding.secondaryColor || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        branding: { ...config.branding, secondaryColor: e.target.value },
                      })
                    }
                    placeholder="#6366f1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Thank You Page Preview</DialogTitle>
            <DialogDescription>
              This is how your Thank You page will appear to users after form submission.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[600px] border rounded-lg"
              title="Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
