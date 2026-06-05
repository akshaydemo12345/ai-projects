import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, CheckCircle2, Palette, Zap, Eye } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { projectsApi, type Branding } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PickrColorInput } from "@/components/ui/PickrColorInput";

interface BrandingSettingsProps {
  projectId: string;
  initialBranding?: Branding;
  onBrandingUpdated?: (branding: Branding) => void;
}

export function BrandingSettings({ projectId, initialBranding, onBrandingUpdated }: BrandingSettingsProps) {
  const [branding, setBranding] = useState<Branding>(initialBranding || getDefaultBranding());
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (initialBranding) {
      setBranding(initialBranding);
    }
  }, [initialBranding]);

  const extractMutation = useMutation({
    mutationFn: (websiteUrl: string) =>
      projectsApi.extractBrandingFromWebsite(projectId, { websiteUrl }),
    onSuccess: (response) => {
      setBranding(response.data.branding);
      onBrandingUpdated?.(response.data.branding);
      toast.success("Branding extracted from website successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to extract branding");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedBranding: Branding) =>
      projectsApi.updateBranding(projectId, { branding: updatedBranding }),
    onSuccess: (response) => {
      setBranding(response.data.branding);
      onBrandingUpdated?.(response.data.branding);
      toast.success("Branding updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update branding");
    },
  });

  const handleColorChange = (path: string, value: string) => {
    const newBranding = { ...branding };
    const keys = path.split(".");
    let obj: any = newBranding;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setBranding(newBranding);
  };

  const handleSave = () => {
    updateMutation.mutate(branding);
  };

  const handleExtractFromWebsite = async () => {
    const websiteUrl = prompt("Enter website URL (e.g., https://example.com):");
    if (websiteUrl) {
      extractMutation.mutate(websiteUrl);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Project Branding
          </h3>
          <p className="text-sm text-gray-500">Customize colors, buttons, navigation, and footer</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExtractFromWebsite}
            disabled={extractMutation.isPending}
          >
            {extractMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Auto Extract
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Tabs for different branding sections */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Color Palette</CardTitle>
              <CardDescription>Define the core colors for your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPickerField
                label="Primary Color"
                value={branding.colors.primary}
                onChange={(value) => handleColorChange("colors.primary", value)}
                onCopy={() => copyToClipboard(branding.colors.primary, "primary")}
                copied={copied === "primary"}
              />
              <ColorPickerField
                label="Secondary Color"
                value={branding.colors.secondary}
                onChange={(value) => handleColorChange("colors.secondary", value)}
                onCopy={() => copyToClipboard(branding.colors.secondary, "secondary")}
                copied={copied === "secondary"}
              />
              <ColorPickerField
                label="Accent Color"
                value={branding.colors.accent}
                onChange={(value) => handleColorChange("colors.accent", value)}
                onCopy={() => copyToClipboard(branding.colors.accent, "accent")}
                copied={copied === "accent"}
              />
              <ColorPickerField
                label="Background Color"
                value={branding.colors.background}
                onChange={(value) => handleColorChange("colors.background", value)}
                onCopy={() => copyToClipboard(branding.colors.background, "background")}
                copied={copied === "background"}
              />
              <ColorPickerField
                label="Surface Color"
                value={branding.colors.surface}
                onChange={(value) => handleColorChange("colors.surface", value)}
                onCopy={() => copyToClipboard(branding.colors.surface, "surface")}
                copied={copied === "surface"}
              />
              <ColorPickerField
                label="Text Color"
                value={branding.colors.text}
                onChange={(value) => handleColorChange("colors.text", value)}
                onCopy={() => copyToClipboard(branding.colors.text, "text")}
                copied={copied === "text"}
              />
              <ColorPickerField
                label="Light Text Color"
                value={branding.colors.textLight}
                onChange={(value) => handleColorChange("colors.textLight", value)}
                onCopy={() => copyToClipboard(branding.colors.textLight, "textLight")}
                copied={copied === "textLight"}
              />
              <ColorPickerField
                label="Border Color"
                value={branding.colors.border}
                onChange={(value) => handleColorChange("colors.border", value)}
                onCopy={() => copyToClipboard(branding.colors.border, "border")}
                copied={copied === "border"}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Primary Button</CardTitle>
              <CardDescription>Configure primary button styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPickerField
                label="Background Color"
                value={branding.buttons.primary.backgroundColor}
                onChange={(value) => handleColorChange("buttons.primary.backgroundColor", value)}
              />
              <ColorPickerField
                label="Text Color"
                value={branding.buttons.primary.textColor}
                onChange={(value) => handleColorChange("buttons.primary.textColor", value)}
              />
              <InputField
                label="Border Radius"
                value={branding.buttons.primary.borderRadius}
                onChange={(value) => handleColorChange("buttons.primary.borderRadius", value)}
                placeholder="e.g., 8px"
              />
              <InputField
                label="Padding"
                value={branding.buttons.primary.padding}
                onChange={(value) => handleColorChange("buttons.primary.padding", value)}
                placeholder="e.g., 12px 24px"
              />
              <InputField
                label="Font Size"
                value={branding.buttons.primary.fontSize}
                onChange={(value) => handleColorChange("buttons.primary.fontSize", value)}
                placeholder="e.g., 14px"
              />
              <InputField
                label="Font Weight"
                value={branding.buttons.primary.fontWeight}
                onChange={(value) => handleColorChange("buttons.primary.fontWeight", value)}
                placeholder="e.g., 600"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Secondary Button</CardTitle>
              <CardDescription>Configure secondary button styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPickerField
                label="Background Color"
                value={branding.buttons.secondary.backgroundColor}
                onChange={(value) => handleColorChange("buttons.secondary.backgroundColor", value)}
              />
              <ColorPickerField
                label="Text Color"
                value={branding.buttons.secondary.textColor}
                onChange={(value) => handleColorChange("buttons.secondary.textColor", value)}
              />
              <InputField
                label="Border Radius"
                value={branding.buttons.secondary.borderRadius}
                onChange={(value) => handleColorChange("buttons.secondary.borderRadius", value)}
                placeholder="e.g., 8px"
              />
              <InputField
                label="Padding"
                value={branding.buttons.secondary.padding}
                onChange={(value) => handleColorChange("buttons.secondary.padding", value)}
                placeholder="e.g., 12px 24px"
              />
              <InputField
                label="Font Size"
                value={branding.buttons.secondary.fontSize}
                onChange={(value) => handleColorChange("buttons.secondary.fontSize", value)}
                placeholder="e.g., 14px"
              />
              <InputField
                label="Font Weight"
                value={branding.buttons.secondary.fontWeight}
                onChange={(value) => handleColorChange("buttons.secondary.fontWeight", value)}
                placeholder="e.g., 600"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Navigation Bar</CardTitle>
              <CardDescription>Configure navigation styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPickerField
                label="Background Color"
                value={branding.navigation.backgroundColor}
                onChange={(value) => handleColorChange("navigation.backgroundColor", value)}
              />
              <ColorPickerField
                label="Text Color"
                value={branding.navigation.textColor}
                onChange={(value) => handleColorChange("navigation.textColor", value)}
              />
              <ColorPickerField
                label="Link Color"
                value={branding.navigation.linkColor}
                onChange={(value) => handleColorChange("navigation.linkColor", value)}
              />
              <ColorPickerField
                label="Active Link Color"
                value={branding.navigation.activeLinkColor}
                onChange={(value) => handleColorChange("navigation.activeLinkColor", value)}
              />
              <ColorPickerField
                label="Hover Background Color"
                value={branding.navigation.hoverBackgroundColor}
                onChange={(value) => handleColorChange("navigation.hoverBackgroundColor", value)}
              />
              <ColorPickerField
                label="Border Color"
                value={branding.navigation.bordercolor}
                onChange={(value) => handleColorChange("navigation.bordercolor", value)}
              />
              <InputField
                label="Height"
                value={branding.navigation.height}
                onChange={(value) => handleColorChange("navigation.height", value)}
                placeholder="e.g., 64px"
              />
              <InputField
                label="Font Size"
                value={branding.navigation.fontSize}
                onChange={(value) => handleColorChange("navigation.fontSize", value)}
                placeholder="e.g., 14px"
              />
              <InputField
                label="Logo Max Height"
                value={branding.navigation.logoMaxHeight}
                onChange={(value) => handleColorChange("navigation.logoMaxHeight", value)}
                placeholder="e.g., 40px"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Tab */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Footer</CardTitle>
              <CardDescription>Configure footer styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ColorPickerField
                label="Background Color"
                value={branding.footer.backgroundColor}
                onChange={(value) => handleColorChange("footer.backgroundColor", value)}
              />
              <ColorPickerField
                label="Text Color"
                value={branding.footer.textColor}
                onChange={(value) => handleColorChange("footer.textColor", value)}
              />
              <ColorPickerField
                label="Link Color"
                value={branding.footer.linkColor}
                onChange={(value) => handleColorChange("footer.linkColor", value)}
              />
              <ColorPickerField
                label="Border Top Color"
                value={branding.footer.borderTopColor}
                onChange={(value) => handleColorChange("footer.borderTopColor", value)}
              />
              <InputField
                label="Padding"
                value={branding.footer.padding}
                onChange={(value) => handleColorChange("footer.padding", value)}
                placeholder="e.g., 48px 24px"
              />
              <InputField
                label="Font Size"
                value={branding.footer.fontSize}
                onChange={(value) => handleColorChange("footer.fontSize", value)}
                placeholder="e.g., 14px"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Section */}
      {showPreview && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <BrandingPreview branding={branding} />
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-8"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Branding"
          )}
        </Button>
      </div>
    </div>
  );
}

// Helper Components
function ColorPickerField({
  label,
  value,
  onChange,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 flex-1">
            <PickrColorInput
              value={value}
              onChange={(val) => onChange(val)}
              className="w-12 h-10 border border-gray-300"
            />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="font-mono"
            />
          </div>
          {onCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="px-2"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-2">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function BrandingPreview({ branding }: { branding: Branding }) {
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{
        backgroundColor: branding.colors.background,
        color: branding.colors.text,
      }}
    >
      {/* Navigation Preview */}
      <div
        style={{
          backgroundColor: branding.navigation.backgroundColor,
          color: branding.navigation.textColor,
          height: branding.navigation.height,
          padding: branding.navigation.padding,
          borderBottom: `1px solid ${branding.navigation.bordercolor}`,
        }}
        className="flex items-center justify-between"
      >
        <div style={{ fontSize: branding.navigation.fontSize, fontWeight: "bold" }}>Logo</div>
        <div className="flex gap-6" style={{ fontSize: branding.navigation.fontSize }}>
          <a style={{ color: branding.navigation.linkColor }} href="#">
            Home
          </a>
          <a style={{ color: branding.navigation.activeLinkColor }} href="#">
            About
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          backgroundColor: branding.colors.surface,
          padding: "40px",
        }}
      >
        <h2 style={{ color: branding.colors.primary, fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
          Welcome to Our Brand
        </h2>
        <p style={{ color: branding.colors.textLight, marginBottom: "20px" }}>
          This is a preview of your branding colors and styling.
        </p>

        {/* Buttons Preview */}
        <div className="flex gap-4 mb-8">
          <button
            style={{
              backgroundColor: branding.buttons.primary.backgroundColor,
              color: branding.buttons.primary.textColor,
              borderRadius: branding.buttons.primary.borderRadius,
              padding: branding.buttons.primary.padding,
              fontSize: branding.buttons.primary.fontSize,
              fontWeight: branding.buttons.primary.fontWeight,
              border: `1px solid ${branding.buttons.primary.borderColor}`,
            }}
          >
            Primary Button
          </button>
          <button
            style={{
              backgroundColor: branding.buttons.secondary.backgroundColor,
              color: branding.buttons.secondary.textColor,
              borderRadius: branding.buttons.secondary.borderRadius,
              padding: branding.buttons.secondary.padding,
              fontSize: branding.buttons.secondary.fontSize,
              fontWeight: branding.buttons.secondary.fontWeight,
              border: `1px solid ${branding.buttons.secondary.borderColor}`,
            }}
          >
            Secondary Button
          </button>
        </div>
      </div>

      {/* Footer Preview */}
      <div
        style={{
          backgroundColor: branding.footer.backgroundColor,
          color: branding.footer.textColor,
          padding: branding.footer.padding,
          fontSize: branding.footer.fontSize,
          borderTop: `1px solid ${branding.footer.borderTopColor}`,
        }}
      >
        <div className="flex justify-between">
          <div>© 2024 Your Brand. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" style={{ color: branding.footer.linkColor }}>
              Privacy
            </a>
            <a href="#" style={{ color: branding.footer.linkColor }}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultBranding(): Branding {
  return {
    colors: {
      primary: "#7c3aed",
      secondary: "#6366f1",
      accent: "#f97316",
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#1f2937",
      textLight: "#6b7280",
      border: "#e5e7eb",
    },
    buttons: {
      primary: {
        backgroundColor: "#7c3aed",
        textColor: "#ffffff",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "14px",
        fontWeight: "600",
        borderColor: "#7c3aed",
      },
      secondary: {
        backgroundColor: "#ffffff",
        textColor: "#7c3aed",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "14px",
        fontWeight: "600",
        borderColor: "#7c3aed",
      },
    },
    navigation: {
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      linkColor: "#7c3aed",
      activeLinkColor: "#7c3aed",
      hoverBackgroundColor: "#f3f4f6",
      bordercolor: "#e5e7eb",
      height: "64px",
      fontSize: "14px",
      padding: "0 24px",
      logoMaxHeight: "40px",
    },
    footer: {
      backgroundColor: "#1f2937",
      textColor: "#f3f4f6",
      linkColor: "#60a5fa",
      borderTopColor: "#374151",
      padding: "48px 24px",
      fontSize: "14px",
    },
  };
}
