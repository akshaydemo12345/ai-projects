import { useState, useEffect } from "react";
import { sectionsApi, type PageSection } from "@/services/api";
import { pageService } from "@/services/pageService";
import EditorTopBar from "@/components/editor/EditorTopBar";
import EditorLeftSidebar from "@/components/editor/EditorLeftSidebar";
import EditorCanvas from "@/components/editor/EditorCanvas";
import EditorRightSidebar from "@/components/editor/EditorRightSidebar";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get("id");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState("AI Landing Page Overlay");
  const [metaDesc, setMetaDesc] = useState("Dynamically generated with gpt-4o-mini");
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await pageService.getById(pageId);
        if (res.status === "success" && res.data?.page) {
          const page = res.data.page;
          setPageTitle(page.title || "AI Generated Page");
          setMetaDesc(page.seo?.description || "");
          setPreviewToken(page.previewToken || page._id);

          // Map AI Content JSON to Editor Sections
          const aiJson = page.content || {};
          const mappedSections: PageSection[] = [];

          if (aiJson.hero) {
            mappedSections.push({
              id: "hero-1",
              type: "hero",
              title: "Hero Section",
              content: {
                heading: aiJson.hero.headline || aiJson.hero.heading,
                subheading: aiJson.hero.subheadline || aiJson.hero.subheading,
                cta: aiJson.hero.ctaText || aiJson.hero.cta,
              }
            });
          }

          if (aiJson.features && Array.isArray(aiJson.features)) {
            mappedSections.push({
              id: "features-1",
              type: "features",
              title: "Features Grid",
              content: { features: aiJson.features }
            });
          }

          if (aiJson.testimonials && Array.isArray(aiJson.testimonials)) {
            mappedSections.push({
              id: "testimonials-1",
              type: "testimonials",
              title: "Testimonials",
              content: { testimonials: aiJson.testimonials }
            });
          }

          if (aiJson.faq && Array.isArray(aiJson.faq)) {
            mappedSections.push({
              id: "faq-1",
              type: "faq",
              title: "FAQ Section",
              content: { faq: aiJson.faq }
            });
          }

          if (aiJson.benefits && Array.isArray(aiJson.benefits)) {
            mappedSections.push({
              id: "benefits-1",
              type: "benefits",
              title: "Key Benefits",
              content: { benefits: aiJson.benefits }
            });
          }

          if (aiJson.about) {
             mappedSections.push({
               id: "about-1",
               type: "features", // Or a new About type, let's use features for now
               title: "About Us",
               content: { title: "About Our Company", description: aiJson.about.content || aiJson.about }
             });
          }

          if (aiJson.pricing && Array.isArray(aiJson.pricing)) {
              mappedSections.push({
                id: "pricing-1",
                type: "pricing",
                title: "Pricing Plans",
                content: { plans: aiJson.pricing }
              });
          }

          if (aiJson.contact) {
              mappedSections.push({
                id: "contact-1",
                type: "contact",
                title: "Contact Section",
                content: { info: aiJson.contact }
              });
          }

          // Fallback if no sections were generated
          if (mappedSections.length === 0) {
            const defaults = await sectionsApi.getAll();
            setSections(defaults);
          } else {
            setSections(mappedSections);
          }
        }
      } catch (error) {
        console.error("Failed to load page:", error);
        toast.error("Failed to load your AI-generated page.");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const selected = sections.find((s) => s.id === selectedSection);

  const handleUpdateContent = (id: string, content: Record<string, unknown>) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
    sectionsApi.update(id, { content });
  };

  const handleAddSection = async (type: PageSection["type"]) => {
    const titles: Record<string, string> = {
      hero: "Hero Section",
      features: "Features Grid",
      testimonials: "Testimonials",
      pricing: "Pricing",
      contact: "Contact Form",
    };
    const defaultContent: Record<string, Record<string, unknown>> = {
      hero: { heading: "Your Heading Here", subheading: "Your subheading", cta: "Get Started" },
      features: { features: [{ title: "Feature 1", description: "Description" }, { title: "Feature 2", description: "Description" }, { title: "Feature 3", description: "Description" }] },
      testimonials: { testimonials: [] },
      pricing: { plans: [] },
      contact: { email: "", phone: "" },
    };
    const newSection = await sectionsApi.create({
      type,
      title: titles[type],
      content: defaultContent[type] || {},
    });
    setSections((prev) => [...prev, newSection]);
    setSelectedSection(newSection.id);
    toast.success(`${titles[type]} added`);
  };

  const handleSave = () => {
    toast.success("Page saved successfully!");
  };

  const handleImproveWithAI = async () => {
    if (!selectedSection || !pageId) {
      toast.error("Please select a section first.");
      return;
    }

    const instruction = prompt("How should AI improve this section? (e.g., 'Make it more professional', 'Add a sense of urgency')");
    if (!instruction) return;

    const currentSection = sections.find(s => s.id === selectedSection);
    if (!currentSection) return;

    setLoading(true);
    try {
      const res = await pageService.improveContent({
        pageId,
        sectionType: currentSection.type,
        currentContent: currentSection.content,
        aiPrompt: instruction
      });

      if (res.status === "success" && res.data?.improvedContent) {
        handleUpdateContent(selectedSection, res.data.improvedContent);
        toast.success("Section improved by AI!");
      } else {
        throw new Error(res.message || "Improvement failed");
      }
    } catch (error: any) {
      console.error("AI Improve Error:", error);
      toast.error(error.message || "Failed to improve section with AI.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading AI generated content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <EditorTopBar title={pageTitle} onSave={handleSave} onImprove={handleImproveWithAI} />
      <EditorLeftSidebar
        sections={sections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        onReorderSections={setSections}
        onAddSection={handleAddSection}
        pageTitle={pageTitle}
        metaDesc={metaDesc}
        onPageTitleChange={setPageTitle}
        onMetaDescChange={setMetaDesc}
      />
      <EditorCanvas
        sections={sections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        previewToken={previewToken}
      />
      <EditorRightSidebar
        selected={selected}
        onUpdateContent={handleUpdateContent}
      />
    </div>
  );
};

export default EditorPage;
