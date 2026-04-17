import { useState, useEffect } from 'react';
import { thankYouApi, ThankYouLayout } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ThankYouLayoutSelectorProps {
  selectedLayout: string;
  onLayoutSelect: (layoutId: string) => void;
  industry?: string;
  autoSelect?: boolean;
}

export const ThankYouLayoutSelector = ({ selectedLayout, onLayoutSelect, industry, autoSelect = true }: ThankYouLayoutSelectorProps) => {
  const [layouts, setLayouts] = useState<ThankYouLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewLayout, setPreviewLayout] = useState<ThankYouLayout | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  useEffect(() => {
    loadLayouts();
  }, []);

  useEffect(() => {
    // Auto-select layout based on industry if enabled and no layout is selected
    if (autoSelect && !selectedLayout && industry && layouts.length > 0) {
      const industryLayout = layouts.find(l => l.industry === industry);
      if (industryLayout) {
        onLayoutSelect(industryLayout.id);
      }
    }
  }, [industry, layouts, selectedLayout, autoSelect, onLayoutSelect]);

  const loadLayouts = async () => {
    try {
      const data = await thankYouApi.getLayouts();
      setLayouts(data);
    } catch (error) {
      console.error('Error loading layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (layout: ThankYouLayout) => {
    setPreviewLayout(layout);
    try {
      const html = await thankYouApi.preview({
        layout: layout.id,
        content: layout.defaultContent,
        branding: layout.theme,
      });
      setPreviewHtml(html);
    } catch (error) {
      console.error('Error previewing layout:', error);
    }
  };

  const filteredLayouts = industry
    ? layouts.filter(l => l.industry === industry || l.industry === 'general')
    : layouts;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLayouts.map((layout) => (
          <Card
            key={layout.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedLayout === layout.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onLayoutSelect(layout.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{layout.name}</CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {layout.description}
                  </CardDescription>
                </div>
                {selectedLayout === layout.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="aspect-video rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer group"
                  style={{
                    background: `linear-gradient(135deg, ${layout.theme.primaryColor}20, ${layout.theme.secondaryColor}20)`,
                    border: `2px solid ${layout.theme.primaryColor}30`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(layout);
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${layout.theme.primaryColor}, ${layout.theme.secondaryColor})`,
                    }}
                  />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${layout.theme.primaryColor}, ${layout.theme.secondaryColor})`
                      }}
                    >
                      <span className="text-2xl font-bold text-white">
                        {layout.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {layout.name}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {layout.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${layout.theme.primaryColor}15`,
                        color: layout.theme.primaryColor
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(layout);
                  }}
                  style={{
                    borderColor: layout.theme.primaryColor,
                    color: layout.theme.primaryColor
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!previewLayout} onOpenChange={() => setPreviewLayout(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Preview: {previewLayout?.name}</DialogTitle>
            <DialogDescription>
              This is how the Thank You page will appear with the selected layout.
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
