import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Brain, Loader2, X, Upload,
  Figma, LayoutTemplate, CheckCircle2, ChevronRight, Zap, Eye, MapPin, Search, Globe
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, pagesApi, aiApi, type Project, type LandingPage } from "@/services/api";
import { toast } from "sonner";
import { getImageAverageBrightness, getLogoPreviewContainerClasses, normalizeLogoUrl } from "@/lib/utils";
import { ModernLoader } from "@/components/ui/ModernLoader";
import { PickrColorInput } from "@/components/ui/PickrColorInput";
import { healthcare01Html, healthcare01Styles } from "../templates/healthcare/templates01";
import { healthcare02Html, healthcare02Styles } from "../templates/healthcare/templates02";
import { healthcare03Html, healthcare03Styles } from "../templates/healthcare/templates03";
import { healthcare04Html, healthcare04Styles } from "../templates/healthcare/templates04";
import { travel01Html, travel01Styles } from "../templates/travel/templates01";
import { travel02Html, travel02Styles } from "../templates/travel/templates02";
import { travel03Html, travel03Styles } from "../templates/travel/templates03";
import { travel04Html, travel04Styles } from "../templates/travel/templates04";
import { finance01Html, finance01Styles } from "../templates/finance/templates01";
import { finance02Html, finance02Styles } from "../templates/finance/templates02";
import { finance03Html, finance03Styles } from "../templates/finance/templates03";
import { finance04Html, finance04Styles } from "../templates/finance/templates04";
import { law01Html, law01Styles } from "../templates/law/templates01";
import { law02Html, law02Styles } from "../templates/law/templates02";
import { useState, useEffect } from "react";

// Templates removed as per user request

// ─── helpers ─────────────────────────────────────────────────────────────────
const autoSlug = (v: string) =>
  v
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const hexToRgbStr = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
};

const generateAiPage = (
  prompt: string,
  project: Project,
  branding: { primary: string; secondary: string; logo?: string }
): Partial<LandingPage> => {
  const dummyHtml = `
    <div style="font-family: 'Inter', sans-serif; color: #333;">
      <style>
        :root {
          --primary: ${branding.primary};
          --secondary: ${branding.secondary};
          --primary-rgb: ${hexToRgbStr(branding.primary)};
          --secondary-rgb: ${hexToRgbStr(branding.secondary)};
        }
      </style>
      <!-- Section 1: Hero -->
      <section style="background: linear-gradient(135deg, var(--primary), var(--secondary)); padding: 100px 20px; text-align: center; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 800;">Welcome to ${project.name || "Our Business"}</h1>
        <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 30px; opacity: 0.9;">${prompt ? prompt.slice(0, 100) + '...' : 'Discover our premium services tailored just for you. Innovative solutions for modern problems.'}</p>
        <button style="background: white; color: var(--primary); padding: 15px 30px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer;">Get Started Now</button>
      </section>

      <!-- Section 2: Features -->
      <section style="padding: 80px 20px; background: #f8fafc; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 40px; color: #0f172a;">Why Choose Us</h2>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 1000px; margin: 0 auto;">
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">🚀</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Lightning Fast</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Experience unparalleled speed and performance with our optimized solutions.</p>
          </div>
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">🛡️</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Secure & Reliable</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Your data is protected with enterprise-grade security and encryption.</p>
          </div>
          <div style="flex: 1; min-width: 250px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="font-size: 2rem; margin-bottom: 15px;">💡</div>
            <h3 style="font-size: 1.25rem; margin-bottom: 10px;">Smart AI</h3>
            <p style="color: #64748b; font-size: 0.95rem;">Leverage artificial intelligence to automate and streamline your workflows.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: About Us -->
      <section style="padding: 80px 20px; max-width: 1000px; margin: 0 auto; display: flex; align-items: center; gap: 40px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 300px;">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="About Us" style="width: 100%; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1);" />
        </div>
        <div style="flex: 1; min-width: 300px;">
          <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #0f172a;">About ${project.name || "Our Business"}</h2>
          <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">We are a dedicated team of professionals committed to delivering excellence. With years of experience and a passion for innovation, we help businesses achieve their full potential.</p>
          <p style="color: #64748b; font-size: 1.1rem; line-height: 1.6;">Our mission is to empower you with the tools and strategies needed to succeed in today's fast-paced digital landscape.</p>
        </div>
      </section>

      <!-- Section 4: Testimonials -->
      <section style="padding: 80px 20px; background: #0f172a; color: white; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 40px;">What Our Clients Say</h2>
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; max-width: 1000px; margin: 0 auto;">
          <div style="flex: 1; min-width: 250px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px;">
            <div style="color: #fbbf24; font-size: 1.5rem; margin-bottom: 15px;">★★★★★</div>
            <p style="font-style: italic; margin-bottom: 20px; font-size: 1.05rem;">"An absolute game-changer. The platform is incredibly intuitive and the results were immediate."</p>
            <h4 style="font-weight: 600;">Sarah Jenkins</h4>
            <span style="font-size: 0.85rem; opacity: 0.7;">Marketing Director</span>
          </div>
          <div style="flex: 1; min-width: 250px; background: rgba(255,255,255,0.1); padding: 30px; border-radius: 12px;">
            <div style="color: #fbbf24; font-size: 1.5rem; margin-bottom: 15px;">★★★★★</div>
            <p style="font-style: italic; margin-bottom: 20px; font-size: 1.05rem;">"The best investment we've made this year. Exceptional support and a flawless product."</p>
            <h4 style="font-weight: 600;">Michael Chen</h4>
            <span style="font-size: 0.85rem; opacity: 0.7;">CEO, TechFlow</span>
          </div>
        </div>
      </section>

      <!-- Section 5: Lead Capture Form -->
      <section style="padding: 80px 20px; max-width: 600px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 2.5rem; margin-bottom: 15px; color: #0f172a;">Ready to Get Started?</h2>
        <p style="color: #64748b; margin-bottom: 30px; font-size: 1.1rem;">Fill out the form below and our team will contact you shortly.</p>
        <form style="display: flex; flex-direction: column; gap: 15px; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; text-align: left;">
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">Full Name</label>
            <input type="text" placeholder="John Doe" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box;" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">Email Address</label>
            <input type="email" placeholder="john@example.com" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box;" required />
          </div>
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 5px; color: #334155;">How can we help?</label>
            <textarea placeholder="Tell us about your project..." rows="4" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; box-sizing: border-box; resize: vertical;" required></textarea>
          </div>
          <button type="submit" style="background: var(--primary); color: white; padding: 14px; border: none; border-radius: 8px; font-size: 1.05rem; font-weight: bold; cursor: pointer; margin-top: 10px;">Submit Request</button>
        </form>
      </section>

      <!-- Section 6: Footer -->
      <footer style="background: #0f172a; color: #94a3b8; padding: 60px 20px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; text-align: left; gap: 40px; margin-bottom: 40px;">
          <div style="flex: 1; min-width: 250px;">
            <h3 style="color: white; font-size: 1.5rem; margin-bottom: 20px; font-weight: bold;">${project.name || "Our Business"}</h3>
            <p style="line-height: 1.6;">Providing premium services and innovative solutions for businesses worldwide. Your success is our priority.</p>
          </div>
          <div style="flex: 1; min-width: 200px;">
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 20px;">Quick Links</h4>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">About Us</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Our Services</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Testimonials</a></li>
              <li><a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Contact</a></li>
            </ul>
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 20px;">Contact Us</h4>
            <p style="margin-bottom: 10px;">Email: hello@example.com</p>
            <p style="margin-bottom: 10px;">Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Business Avenue, Suite 100<br/>New York, NY 10001</p>
          </div>
        </div>
        <div style="padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem;">
          <p>&copy; ${new Date().getFullYear()} ${project.name || "Our Business"}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `;

  return {
    name: prompt.slice(0, 50).trim() || "AI Generated Page",
    slug: autoSlug(prompt.slice(0, 40).trim() || "ai-page") + "-" + Date.now().toString(36),
    metaTitle: `${project.name} — ${prompt.slice(0, 30)}`,
    metaDescription: `${prompt.slice(0, 120)} | ${project.name}`,
    primaryColor: branding.primary,
    secondaryColor: branding.secondary,
    logoUrl: branding.logo,
    accentColor: "#6366f1",
    generationMethod: "ai" as LandingPage["generationMethod"],
    aiPrompt: prompt,
    content: dummyHtml,
  };
};

// ─── Scraped Data Injection Helper ───────────────────────────────────────────
const injectScrapedDataIntoTemplate = (html: string, project: any, pageTitle: string, subIndustryText: string, logoUrl?: string) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 0. Inject Logo directly into template logo containers
    if (logoUrl) {
      const logoContainers = doc.querySelectorAll(".logo, .site-logo, .brand, .navbar-brand");
      logoContainers.forEach(container => {
        container.innerHTML = `<img src="${logoUrl}" id="page-logo" alt="Logo" style="max-height: 40px; max-width: 200px; width: auto; object-fit: contain;">`;
      });
    }

    // 1. Update H1 and Subtitle
    const h1 = doc.querySelector("h1");
    if (h1) {
      h1.textContent = project?.websiteProfile?.content?.hero?.title || pageTitle;
      h1.style.position = "relative";
      h1.style.zIndex = "10";

      const subtitle = project?.websiteProfile?.content?.hero?.subtitle;
      if (subtitle) {
        let p = h1.nextElementSibling;
        while (p && p.tagName !== 'P' && p.tagName !== 'DIV') {
          p = p.nextElementSibling;
        }
        if (p && p.tagName === 'P') {
          p.textContent = subtitle;
        } else if (h1.parentElement) {
          const parentP = h1.parentElement.querySelector("p");
          if (parentP) parentP.textContent = subtitle;
        }
      }
    }

    // 2. Main description
    const descText = project?.websiteProfile?.identity?.description || project?.description || project?.scrapedData?.description || project?.scrapedData?.about || project?.scrapedData?.summary;
    const allParagraphs = Array.from(doc.querySelectorAll("p")).filter(
      p => !p.closest("footer") && !p.closest("form") && p.textContent && p.textContent.trim().length > 20
    );
    if (descText && allParagraphs.length > 0) {
      allParagraphs[0].textContent = descText;
    }

    // 3. Inject Services
    const services = project?.websiteProfile?.content?.services?.length ? project.websiteProfile.content.services : (project?.scrapedData?.services || []);
    if (services.length > 0) {
      const serviceHeadings = Array.from(doc.querySelectorAll("h3")).filter(
        h3 => !h3.closest(".testi-card") && !h3.closest(".v2-faq-item") && !h3.closest(".blog-card")
      );

      serviceHeadings.forEach((heading, idx) => {
        if (idx < services.length) {
          const service = services[idx];
          if (typeof service === "string") {
            heading.textContent = service;
          } else if (service.title || service.name) {
            heading.textContent = service.title || service.name;
            const parent = heading.parentElement;
            if (parent && service.description) {
              const p = parent.querySelector("p");
              if (p) p.textContent = service.description;
            }
          }
        } else {
          // Remove extra hardcoded service item
          const parent = heading.closest(".service-card, [class*='service-item'], [class*='feature-card'], .process-step, .tour-item, .place-col, .feat-item, .feature, .service-col, .v2-service-card") || heading.parentElement;
          if (parent) {
            parent.remove();
          }
        }
      });
    }

    // 4. Inject Testimonials
    const testimonials = project?.websiteProfile?.content?.testimonials?.length ? project.websiteProfile.content.testimonials : (project?.scrapedData?.testimonials || []);
    if (testimonials.length > 0) {
      const testiCards = Array.from(doc.querySelectorAll(".testi-card, [class*='testimonial']"));
      testiCards.forEach((card, idx) => {
        if (idx < testimonials.length) {
          const t = testimonials[idx];
          const tText = card.querySelector(".testi-text, p");
          if (tText && (t.text || t.content)) tText.textContent = `"${t.text || t.content}"`;

          const tAuthor = card.querySelector(".author-name, h4, .name");
          if (tAuthor && (t.author || t.name)) tAuthor.textContent = t.author || t.name;
        } else {
          card.remove();
        }
      });
    }

    // 5. Inject FAQs
    const faqs = project?.websiteProfile?.content?.faqs?.length ? project.websiteProfile.content.faqs : (project?.scrapedData?.faq || project?.scrapedData?.faqs || []);
    if (faqs.length > 0) {
      const faqItems = Array.from(doc.querySelectorAll("details, .faq-item, .v2-faq-item"));
      faqItems.forEach((item, idx) => {
        if (idx < faqs.length) {
          const faq = faqs[idx];
          const summary = item.querySelector("summary, .faq-question");
          if (summary && faq.question) {
            const icon = summary.querySelector("span, i");
            summary.textContent = faq.question;
            if (icon) summary.appendChild(icon);
          }
          const body = item.querySelector(".v2-faq-body, .faq-body, .faq-answer, p");
          if (body && faq.answer) {
            body.textContent = faq.answer;
          }
        } else {
          item.remove();
        }
      });
    }

    // 6. Inject Videos
    const videos = project?.scrapedData?.videos || [];
    if (videos.length > 0) {
      const videoElements = Array.from(doc.querySelectorAll("video")) as HTMLVideoElement[];
      videoElements.forEach((vid, idx) => {
        if (idx < videos.length) {
          vid.src = typeof videos[idx] === 'string' ? videos[idx] : (videos[idx].url || videos[idx].src);
        }
      });
    }

    // 7. Inject Form / CTA
    const ctaText = project?.websiteProfile?.content?.hero?.ctaText || project?.websiteProfile?.content?.ctas?.[0]?.title || project?.scrapedData?.cta || project?.scrapedData?.forms?.[0]?.title;
    const formHeading = doc.querySelector("form")?.previousElementSibling;
    if (formHeading && (formHeading.tagName === 'H2' || formHeading.tagName === 'H3' || formHeading.tagName === 'H4')) {
      formHeading.textContent = ctaText || "Contact Us";
    }

    const formInnerTitle = doc.querySelector("form .booking-title, form h2, form h3, form h4");
    if (formInnerTitle && ctaText) {
      formInnerTitle.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          node.textContent = ` ${ctaText} `;
        }
      });
    }

    // 8. Fallback for other paragraphs
    const fallbackText = `Welcome to ${pageTitle}. We provide the best ${subIndustryText} solutions tailored to your specific needs. Partner with us for unparalleled success in your industry.`;
    if (allParagraphs.length > 1) {
      for (let i = 1; i < allParagraphs.length; i++) {
        if (allParagraphs[i].closest(".testi-card") || allParagraphs[i].closest(".v2-faq-item") || allParagraphs[i].closest("[class*='card']")) {
          continue;
        }
        if (project?.scrapedData?.summary && i === 1) {
          allParagraphs[i].textContent = project.scrapedData.summary;
        } else if (project?.scrapedData?.about && i === 2) {
          allParagraphs[i].textContent = project.scrapedData.about;
        } else {
          allParagraphs[i].textContent = fallbackText;
        }
      }
    }

    // 9. Force inject Logo if missing or altered by AI
    if (logoUrl) {
      const headerImgs = Array.from(doc.querySelectorAll("header img, .navbar img, .nav img")) as HTMLImageElement[];
      if (headerImgs.length > 0) {
        headerImgs[0].src = logoUrl;
        headerImgs[0].alt = project?.name || "Logo";
        // Ensure it isn't completely generic
        if (headerImgs[0].src.includes("LOGO_PLACEHOLDER")) {
          headerImgs[0].src = logoUrl;
        }
      } else {
        const logoContainer = doc.querySelector(".logo, .brand, .navbar-brand");
        if (logoContainer) {
          const img = logoContainer.querySelector("img") as HTMLImageElement | null;
          if (img) {
            img.src = logoUrl;
            img.alt = project?.name || "Logo";
          } else {
            logoContainer.innerHTML = `<img src="${logoUrl}" alt="${project?.name || 'Logo'}" style="height: 40px; width: auto; object-fit: contain;">`;
          }
        }
      }
    }

    return doc.body.innerHTML;
  } catch (err) {
    console.error("DOM parsing failed", err);
    return html;
  }
};

// ─── Template definitions ─────────────────────────────────────────────────────
const LANDING_TEMPLATES: any[] = [
  {
    id: "law-01",
    name: "Justice Law Firm",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/screenshot.png",
    gradient: "linear-gradient(135deg, #7A28F5 0%, #4615b2 100%)",
    prompt: "A professional law firm landing page with hero header, trust signals, services tabs, attorneys section, and contact lead capture form.",
  },
  {
    id: "law-02",
    name: "Justice Law Firm",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/templates02/lov02.png",
    gradient: "linear-gradient(135deg, #7A28F5 0%, #4615b2 100%)",
    prompt: "A professional law firm landing page with hero header, trust signals, services tabs, attorneys section, and contact lead capture form.",
  },
  {
    id: "healthcare-01",
    name: "Lumina Dental",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates01/dental-screenshot-01.png",
    gradient: "linear-gradient(135deg, #bb0014 0%, #141d23 100%)",
    prompt: "Create a premium dental care landing page for Lumina Dental Excellence. Include a hero section with a booking form, services grid, and patient testimonials.",
  },
  {
    id: "healthcare-02",
    name: "Elite Healthcare",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates02/screnshort81.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
    prompt: "A professional healthcare landing page with a hero background, 3 feature cards, about section with image grid, and a comprehensive services list.",
  },
  {
    id: "healthcare-03",
    name: "Lumina Medical Center",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates03/screnshort82.png",
    gradient: "linear-gradient(135deg, #00d2f3 0%, #5b5ef0 100%)",
    prompt: "A comprehensive healthcare landing page with circular hero image, overlapping about sections, pricing plans, consultation form, and high-tech FAQ.",
  },
  {
    id: "healthcare-04",
    name: "Medlio Healthcare",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates04/H1.png",
    gradient: "linear-gradient(135deg, #1750A8 0%, #e6f2ff 100%)",
    prompt: "A professional medical healthcare landing page featuring a topbar, hero section with badges, 6-grid services, meet our specialists, and an appointment form.",
  },

  {
    id: "travel-01",
    name: "Azure Luxury Escapes",
    tag: "Travel",
    img: "/assets/templates/travel/templates01/newpd.png",
    gradient: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
    prompt: "A luxury travel landing page for Azure Luxury Escapes. High-end feel, teal and aqua color palette, focus on secluded island resorts and private experiences.",
  },
  {
    id: "travel-02",
    name: "Savanna Safari Elite",
    tag: "Travel",
    img: "/assets/templates/travel/templates02/screenshot3.png",
    gradient: "linear-gradient(135deg, #78350f 0%, #1c1917 100%)",
    prompt: "An adventurous luxury safari landing page with a floating booking form, wild animal grids, and conservation focus. Earthy tones and premium photography.",
  },
  {
    id: "travel-03",
    name: "Etheria Journeys",
    tag: "Travel",
    img: "/assets/templates/travel/templates03/screenshot2.png",
    gradient: "linear-gradient(135deg, #0a1128 0%, #c5a059 100%)",
    prompt: "A high-end luxury wellness and soul retreat landing page for Etheria Journeys. Midnight navy and gold palette, minimalist design, and serene nature focus.",
  },
  {
    id: "travel-04",
    name: "Metro City Explorer",
    tag: "Travel",
    img: "/assets/templates/travel/templates04/screenshot4.png",
    gradient: "linear-gradient(135deg, #111827 0%, #374151 100%)",
    prompt: "A modern urban city-break landing page. Bold typography, city night photography, floating booking forms, and trending destination grids. Clean and electric feel.",
  },

  {
    id: "finance-01",
    name: "Elite Wealth",
    tag: "Finance",
    img: "/assets/templates/finance/templates01/screenshot.png",
    gradient: "linear-gradient(135deg, #2b5cff 0%, #1f3aa6 100%)",
    prompt: "A modern finance and consulting landing page for Finova. Professional design with trust-building elements, service highlights, and a clean lead capture form.",
  },
  {
    id: "finance-02",
    name: "Finance Elite 02",
    tag: "Finance",
    img: "/assets/templates/finance/templates02/screen.png",
    gradient: "linear-gradient(135deg, #0a192f 0%, #c5a059 100%)",
    prompt: "An institutional-grade investment management landing page with high-end serif typography, a corporate navy and gold theme, and a professional consultation form.",
  },

  {
    id: "finance-03",
    name: "Aureum Finance Elite",
    tag: "Finance",
    img: "/assets/templates/finance/templates03/screenshot1.png",
    gradient: "linear-gradient(135deg, #050505 0%, #1a1a1a 100%)",
    prompt: "A premium dark-mode finance landing page with gold accents, horizontal hero form, and a streamlined 4-step journey.",
  },

  {
    id: "finance-04",
    name: "Finova Analytics",
    tag: "Finance",
    img: "/assets/templates/finance/templates04/screenshot.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)",
    prompt: "A crisp, data-centric finance landing page ith beautiful gradient backgrounds, real-time analytics mockups, glassmorphism, animations, and lead capture forms.",
  },
];


const TEMPLATE_CATEGORIES = ["All", "Law Firm", "Healthcare", "Travel", "Finance"];

// ─── websiteProfile-aware project data helpers ────────────────────────────────
// Extracts data from the new `websiteProfile` shape first, falls back to legacy fields.
const getProjectIndustry = (p: any): string =>
  p?.websiteProfile?.industry?.industry || p?.industry || p?.category || "Service";

const getProjectSubIndustry = (p: any): string =>
  p?.websiteProfile?.industry?.subIndustry || p?.subIndustry || p?.scrapedData?.subIndustry || "Services";

const getProjectLogoUrl = (p: any): string | undefined =>
  p?.websiteProfile?.identity?.logoUrl || p?.logoUrl;

const getProjectPrimaryColor = (p: any): string =>
  p?.websiteProfile?.logoColors?.primary || p?.websiteProfile?.colors?.primary || p?.primaryColor || "#7c3aed";

const getProjectSecondaryColor = (p: any): string =>
  p?.websiteProfile?.logoColors?.secondary || p?.websiteProfile?.colors?.secondary || p?.secondaryColor || "#6366f1";

const getProjectDescription = (p: any): string =>
  p?.description ||
  p?.websiteProfile?.content?.hero?.subtitle ||
  p?.websiteProfile?.seo?.description ||
  "Premium services";

const getProjectPhone = (p: any): string =>
  p?.websiteProfile?.content?.ctas?.[0]?.buttonText ||
  p?.phone ||
  p?.scrapedData?.phone ||
  "+1 (800) 123-4567";

const getProjectEmail = (p: any): string =>
  p?.fromEmail ||
  p?.contactEmail ||
  p?.websiteProfile?.seo?.openGraph?.url ||
  p?.scrapedData?.email ||
  "contact@example.com";

const getProjectAddress = (p: any): string =>
  p?.scrapedData?.address ||
  "123 Business Avenue, New York, NY";

const getProjectScrapedData = (p: any) => ({
  ...(p?.scrapedData || {}),
  description: p?.description || p?.websiteProfile?.content?.hero?.subtitle || p?.websiteProfile?.seo?.description || p?.scrapedData?.description,
  summary: p?.websiteProfile?.content?.hero?.subtitle || p?.scrapedData?.summary,
  about: p?.websiteProfile?.content?.hero?.subtitle || p?.scrapedData?.about,
  services: p?.websiteProfile?.content?.services || p?.scrapedData?.services || [],
  testimonials: p?.websiteProfile?.content?.testimonials || p?.scrapedData?.testimonials || [],
  faq: p?.websiteProfile?.content?.ctas || p?.scrapedData?.faq || p?.scrapedData?.faqs || [],
  phone: getProjectPhone(p),
  email: getProjectEmail(p),
  address: getProjectAddress(p),
});


type CreationMethod = "ai" | "figma" | "template";

// ─── CreatePagePage ───────────────────────────────────────────────────────────
const CreatePagePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectsApi.getById(id!),
    enabled: !!id,
  });

  const { data: projectPages = [] } = useQuery({
    queryKey: ["project-pages", id],
    queryFn: () => pagesApi.getPagesByProject(id!),
    enabled: !!id,
  });

  const [slugError, setSlugError] = useState("");
  const [pageNameError, setPageNameError] = useState("");
  const [methodError, setMethodError] = useState("");
  const [isSlugVerified, setIsSlugVerified] = useState(false);
  const [isVerifyingSlug, setIsVerifyingSlug] = useState(false);

  const { data: suggestionsData } = useQuery({
    queryKey: ["project-suggestions", id],
    queryFn: () => aiApi.projectSuggestions(id!),
    enabled: !!id,
  });

  const dynamicSuggestions = suggestionsData?.data?.suggestions || [];

  const [activeMethod, setActiveMethod] = useState<CreationMethod>("ai");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState("All");

  const [pageName, setPageName] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [noIndexNoFollow, setNoIndexNoFollow] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#6366f1");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [logoPreviewBgClass, setLogoPreviewBgClass] = useState<string>("border border-slate-700 bg-slate-950 dark:border-slate-500 dark:bg-slate-950");
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

  // Whether the current primary/secondary colors were extracted from the logo
  const isColorsFromLogo = !!(project?.websiteProfile?.logoColors?.source);

  const handleLogoPreviewImageLoad = async (img: HTMLImageElement) => {
    const brightness = getImageAverageBrightness(img);
    setLogoPreviewBgClass(getLogoPreviewContainerClasses(brightness));
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  const [figmaFile, setFigmaFile] = useState<File | null>(null);
  const [figmaPreview, setFigmaPreview] = useState<string | null>(null);
  const [figmaBase64, setFigmaBase64] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);

  // Helper to get an image URL for a given industry (static dummy URLs – random selection)
  const industryImages: Record<string, string[]> = {
    Travel: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
    ],
    Finance: [
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80&w=500",
    ],
    Healthcare: [
      "https://images.unsplash.com/photo-1511174511562-5f7f18b8742e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?auto=format&fit=crop&q=80&w=500",
    ],
    default: [
      "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=80",
    ],
  };

  const getImageForIndustry = (industry: string): string => {
    const candidates = industryImages[industry] ?? industryImages.default;
    // Pick a random image from the list each time the function is called
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx];
  };

  // Simulated AI image generation button (frontend‑only)
  const AiGenerateButton: React.FC<{ industry: string }> = ({ industry }) => {
    const [generating, setGenerating] = useState(false);

    const handleGenerate = () => {
      setGenerating(true);
      // Fake delay to mimic AI processing
      setTimeout(() => {
        if (previewTemplate && previewTemplate.html) {
          let newHtml = previewTemplate.html;

          // Replace all common hardcoded placeholders in the preview with dynamic industry images
          const urlRegex = /(https:\/\/images\.unsplash\.com\/[^"'\s\)]+|\/assets\/templates\/[^"'\s\)]+)/gi;
          newHtml = newHtml.replace(urlRegex, () => getImageForIndustry(industry));
          newHtml = newHtml.replace(/{{IMG}}/g, () => getImageForIndustry(industry));

          setPreviewTemplate({ ...previewTemplate, html: newHtml });
        }
        setGenerating(false);
        toast.success("AI images preview generated!");
      }, 800);
    };

    return (
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="mt-0 btn-primary flex items-center gap-2"
      >
        {generating ? "Generating…" : "Generate AI Images"}
      </button>
    );
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const [showLoader, setShowLoader] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [createdPage, setCreatedPage] = useState<any>(null);
  const [faviconBroken, setFaviconBroken] = useState(false);

  useEffect(() => {
    if (project) {
      // Only set initial branding if it hasn't been set yet or if the project ID changed
      // to avoid overwriting user edits when React Query refetches in the background
      setPrimaryColor(prev => prev === "#7c3aed" ? getProjectPrimaryColor(project) : prev);
      setSecondaryColor(prev => prev === "#6366f1" ? getProjectSecondaryColor(project) : prev);
      const logo = getProjectLogoUrl(project);
      if (logo && !logoPreview) {
        setLogoPreview(logo);
        setLogoUrl(logo);
      }
    }
  }, [project?._id]);

  // Debounced background check for slug availability (checks local DB & external website)
  useEffect(() => {
    const normalizedSlug = normalizeSlug(pageSlug);
    if (!normalizedSlug) {
      setIsSlugVerified(false);
      setSlugError("");
      return;
    }

    const isDuplicate = projectPages.some((page: any) => normalizeSlug(page.slug || "") === normalizedSlug);
    if (isDuplicate) {
      setSlugError("This URL slug already exists in this project. Please choose a different page name.");
      setIsSlugVerified(false);
      return;
    }

    setSlugError("");

    const timer = setTimeout(async () => {
      await verifySlugAvailability(normalizedSlug, true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [pageSlug, projectPages]);

  const normalizeSlug = (value: string) => autoSlug(value.trim());

  const validateDuplicateSlug = (slugValue: string) => {
    const normalizedSlug = normalizeSlug(slugValue);
    if (!normalizedSlug) {
      setSlugError("");
      setIsSlugVerified(false);
      return false;
    }

    const slugAlreadyExists = projectPages.some((page: any) => normalizeSlug(page.slug || "") === normalizedSlug);
    if (slugAlreadyExists) {
      setSlugError("This URL slug already exists in this project. Please choose a different page name.");
      setIsSlugVerified(false);
      return true;
    }

    setSlugError("");
    return false;
  };

  const verifySlugAvailability = async (slugValue: string, silent = false) => {
    const normalizedSlug = normalizeSlug(slugValue);
    if (!normalizedSlug) {
      setSlugError("Page name or URL slug is required.");
      setIsSlugVerified(false);
      return true;
    }

    if (validateDuplicateSlug(normalizedSlug)) {
      return true;
    }

    setIsVerifyingSlug(true);
    try {
      await pagesApi.verifySlug(id!, { slug: normalizedSlug });
      setSlugError("");
      setIsSlugVerified(true);
      // Success is shown via the green checkmark icon in the input — no toast
      return false;
    } catch (err: any) {
      const errorMsg = err.message || "This URL slug is unavailable.";
      // Show error inline in the input field only — no toast
      if (errorMsg.includes("already exists on website")) {
        setSlugError("This URL slug already exists on your live website. Please choose a different one.");
      } else {
        setSlugError(errorMsg);
      }
      setIsSlugVerified(false);
      return true;
    } finally {
      setIsVerifyingSlug(false);
    }
  };

  const validateForm = async () => {
    let isValid = true;
    const normalizedSlug = normalizeSlug(pageSlug || pageName);

    if (!pageName.trim()) {
      setPageNameError("Page name is required.");
      isValid = false;
    } else {
      setPageNameError("");
    }

    if (!normalizedSlug) {
      setSlugError("Please enter a valid page name or URL slug.");
      setIsSlugVerified(false);
      isValid = false;
    }

    if (activeMethod === "ai") {
      if (!aiPrompt.trim()) {
        setMethodError("Describe your page for AI generation.");
        isValid = false;
      } else {
        setMethodError("");
      }
    } else if (activeMethod === "template") {
      if (!selectedTemplate) {
        setMethodError("Select a template before generating.");
        isValid = false;
      } else {
        setMethodError("");
      }
    } else if (activeMethod === "figma") {
      if (!figmaFile) {
        setMethodError("Upload a Figma or design file before generating.");
        isValid = false;
      } else {
        setMethodError("");
      }
    } else {
      setMethodError("");
    }

    if (!isValid) {
      return false;
    }

    if (!isSlugVerified) {
      const hasError = await verifySlugAvailability(normalizedSlug, false);
      if (hasError) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handlePageNameBlur = async () => {
    if (!pageName.trim()) {
      setPageNameError("Page name is required.");
      setSlugError("");
      setIsSlugVerified(false);
      return;
    }

    setPageNameError("");
    const generatedSlug = normalizeSlug(pageName);
    setPageSlug(generatedSlug);
    await verifySlugAvailability(generatedSlug, false);
  };

  const handleSlugBlur = async () => {
    const normalizedSlug = normalizeSlug(pageSlug || pageName);
    setPageSlug(normalizedSlug);
    await verifySlugAvailability(normalizedSlug, false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    const r = new FileReader();
    r.onloadend = () => setLogoUrl(r.result as string);
    r.readAsDataURL(file);
  };

  const handleFigmaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFigmaFile(file);
    if (file.type.startsWith("image/")) {
      setFigmaPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setFigmaBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
    toast.success(`"${file.name}" selected`);
  };

  const handleTemplateSelect = (tpl: typeof LANDING_TEMPLATES[0]) => {
    if (selectedTemplate === tpl.id) {
      setSelectedTemplate(null);
      setAiPrompt("");
      toast.info(`Deselected: ${tpl.name}`);
    } else {
      setSelectedTemplate(tpl.id);
      setAiPrompt(tpl.prompt);
      setActiveMethod("template");
      toast.info(`Selected Template: ${tpl.name}`);
    }
  };

  const handleViewTemplate = (tpl: any) => {
    setPreviewTemplate(tpl);
  };

  const createPageMutation = useMutation({
    mutationFn: async (page: Partial<LandingPage>) => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Generation timed out. Please try again.")), 180000)
      );
      return Promise.race([pagesApi.create(id!, page), timeoutPromise]) as Promise<LandingPage>;
    },
    onSuccess: (newPage) => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setCreatedPage(newPage);
      setIsComplete(true);
    },
    onError: (err: any) => {
      console.error("Mutation Error:", err);
      toast.error(err.message || "Failed to create page");
      setShowLoader(false);
      setIsComplete(false);
    },
  });

  const handleGenerateMagicPrompt = async () => {
    if (!pageName.trim()) { toast.error("Enter a page name first."); return; }
    setIsGeneratingPrompt(true);
    try {
      const res = await aiApi.generateDescription({
        pageName,
        industry: getProjectIndustry(project),
        projectDesc: project?.description,
        currentPrompt: aiPrompt.trim() || undefined,
        projectId: id,
        uiPrimaryColor: primaryColor,
        uiSecondaryColor: secondaryColor,
      });
      const suggestionText = typeof res.data.suggestion === 'object'
        ? res.data.suggestion.suggestion
        : res.data.suggestion;
      setAiPrompt(suggestionText);
      toast.success(aiPrompt.trim() ? "Prompt expanded!" : "Magic prompt generated!");
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleCreate = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    if (!project) return;

    setShowLoader(true);
    setIsComplete(false);

    // ─── PURE AI PATH: Always call real Claude API when method is "ai" ───
    if (activeMethod === "ai") {
      try {
        // ── Build websiteContent from scraped project data so Claude uses real business info ──
        const sd = project?.scrapedData || {};
        const scrapedLines: string[] = [];
        if (sd.about) scrapedLines.push(`About: ${sd.about}`);
        if (sd.summary) scrapedLines.push(`Summary: ${sd.summary}`);
        if (sd.description) scrapedLines.push(`Description: ${sd.description}`);
        if (sd.phone) scrapedLines.push(`Phone: ${sd.phone}`);
        if (sd.email) scrapedLines.push(`Email: ${sd.email}`);
        if (sd.address) scrapedLines.push(`Address: ${sd.address}`);
        if (Array.isArray(sd.services) && sd.services.length > 0) {
          const svcList = sd.services
            .map((s: any) => (typeof s === 'string' ? s : (s.title || s.name || '')))
            .filter(Boolean).join(', ');
          scrapedLines.push(`Services: ${svcList}`);
        }
        if (Array.isArray(sd.testimonials) && sd.testimonials.length > 0) {
          const testiList = sd.testimonials
            .slice(0, 3)
            .map((t: any) => `"${t.text || t.content || ''}" — ${t.author || t.name || 'Client'}`)
            .join(' | ');
          scrapedLines.push(`Testimonials: ${testiList}`);
        }
        if (Array.isArray(sd.faq) && sd.faq.length > 0) {
          const faqList = sd.faq
            .slice(0, 4)
            .map((f: any) => `Q: ${f.question} A: ${f.answer}`)
            .join(' | ');
          scrapedLines.push(`FAQs: ${faqList}`);
        }
        const websiteContent = scrapedLines.join('\n');

        // Merge project services with scraped services (deduplicated)
        const allServices = [
          ...(project?.services || []),
          ...(Array.isArray(sd.services)
            ? sd.services.map((s: any) => (typeof s === 'string' ? s : (s.title || s.name || ''))).filter(Boolean)
            : [])
        ].filter((v, i, a) => a.indexOf(v) === i);

        const generationRes = await aiApi.generate({
          businessName: project.name,
          industry: project.category || project.industry || "Service",
          businessDescription: project.description || sd.about || sd.summary || "",
          pageType: "lead generation",
          aiPrompt: aiPrompt,
          primaryColor: primaryColor || "#7c3aed",
          secondaryColor: secondaryColor || "#6366f1",
          logoUrl: logoUrl || project.logoUrl,
          targetAudience: sd.targetAudience || "",
          ctaText: "Get Started Free",
          services: allServices.slice(0, 10),
          keywords: project?.keywords || [],
          websiteContent: websiteContent || undefined,
        });

        const aiResult = generationRes?.data?.content;
        if (!aiResult?.fullHtml) throw new Error("AI response missing HTML.");

        const primaryCol = primaryColor || "#6366f1";
        const secondaryCol = secondaryColor || "#4f46e5";
        const brandingCss = `:root{--primary:${primaryCol};--secondary:${secondaryCol};--primary-rgb:${hexToRgbStr(primaryCol)};--secondary-rgb:${hexToRgbStr(secondaryCol)};}`;
        const fullAiHtml = aiResult.fullHtml.includes('<!DOCTYPE') ? aiResult.fullHtml : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${pageName.trim() || project.name}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
  <style>${brandingCss}\n${aiResult.fullCss || ""}</style>
</head>
<body>${aiResult.fullHtml}</body>
</html>`;

        createPageMutation.mutate({
          name: pageName.trim(),
          slug: pageSlug.trim() || autoSlug(pageName),
          metaTitle: `${project.name} - ${pageName.trim()}`,
          metaDescription: project.description || `${pageName.trim()} by ${project.name}.`,
          noIndexNoFollow,
          primaryColor,
          secondaryColor,
          logoUrl,
          industry: project?.category || project?.industry || "Service",
          subIndustry: project?.subIndustry || "Services",
          aiPrompt,
          generationMethod: "ai" as LandingPage["generationMethod"],
          accentColor: "#6366f1",
          type: "ppc",
          status: "draft",
          content: { fullHtml: fullAiHtml, html: aiResult.fullHtml, fullCss: aiResult.fullCss || "" },
          styles: aiResult.fullCss || "",
          landingPageContent: fullAiHtml,
          landingPageStyles: aiResult.fullCss || "",
        });
      } catch (err: any) {
        toast.error(err.message || "AI generation failed. Please try again.");
        setShowLoader(false);
        setIsComplete(false);
      }
      return;
    }

    let basePayload: Partial<LandingPage> = {};
    let finalTemplateId = selectedTemplate;
    let isAiTemplatePath = false;

    if ((activeMethod === "template" && finalTemplateId) || isAiTemplatePath) {
      let enrichedContent = "";
      let enrichedStyles = "";
      const templateObj = LANDING_TEMPLATES.find(t => t.id === finalTemplateId);
      const tName = templateObj?.name || "Template";

      switch (finalTemplateId) {
        case "law-01": enrichedContent = law01Html; enrichedStyles = law01Styles; break;
        case "law-02": enrichedContent = law02Html; enrichedStyles = law02Styles; break;
        case "healthcare-01": enrichedContent = healthcare01Html; enrichedStyles = healthcare01Styles; break;
        case "healthcare-02": enrichedContent = healthcare02Html; enrichedStyles = healthcare02Styles; break;
        case "healthcare-03": enrichedContent = healthcare03Html; enrichedStyles = healthcare03Styles; break;
        case "healthcare-04": enrichedContent = healthcare04Html; enrichedStyles = healthcare04Styles; break;
        case "travel-01": enrichedContent = travel01Html; enrichedStyles = travel01Styles; break;
        case "travel-02": enrichedContent = travel02Html; enrichedStyles = travel02Styles; break;
        case "travel-03": enrichedContent = travel03Html; enrichedStyles = travel03Styles; break;
        case "travel-04": enrichedContent = travel04Html; enrichedStyles = travel04Styles; break;
        case "finance-01": enrichedContent = finance01Html; enrichedStyles = finance01Styles; break;
        case "finance-02": enrichedContent = finance02Html; enrichedStyles = finance02Styles; break;
        case "finance-03": enrichedContent = finance03Html; enrichedStyles = finance03Styles; break;
        case "finance-04": enrichedContent = finance04Html; enrichedStyles = finance04Styles; break;
        default: enrichedContent = ""; enrichedStyles = "";
      }

      // ─── AI-POWERED TEMPLATE REGENERATION (Claude) ───
      // ONLY run this if we are in the "AI" path (isAiTemplatePath === true)
      if (isAiTemplatePath) {
        try {
          const generationRes = await aiApi.generate({
            businessName: project.name,
            industry: getProjectIndustry(project),
            businessDescription: getProjectDescription(project),
            pageType: "lead generation",
            aiPrompt: aiPrompt,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            logoUrl: logoUrl,
            // If it's a direct AI prompt, we don't pass the base template so the AI is forced to start from scratch
            templateHtml: (activeMethod as string) === "ai" ? "" : enrichedContent,
            templateStyles: (activeMethod as string) === "ai" ? "" : enrichedStyles
          });

          const aiResult = generationRes?.data?.content;
          if (aiResult && aiResult.fullHtml) {
            let extractedHtml = aiResult.fullHtml;
            // Prevent nested HTML documents which break browser rendering and FAQ details tags
            const bodyMatch = extractedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
              extractedHtml = bodyMatch[1];
            }
            enrichedContent = extractedHtml;
            if (aiResult.fullCss && aiResult.fullCss.length > 50) {
              enrichedStyles = aiResult.fullCss;
            }
            toast.success("Claude: Template regenerated with your vision!");
          }
        } catch (err) {
          console.error("AI Template Regeneration failed:", err);
          toast.warning("AI regeneration failed, using base template with placeholders.");
        }
      }

      const finalLogo = logoUrl || project?.websiteProfile?.identity?.logoUrl || project.logoUrl || project.scrapedData?.logo || getProjectLogoUrl(project);
      const logoHtml = finalLogo
        ? `<img src="${finalLogo}" id="page-logo" alt="Logo" style="max-height: 40px; max-width: 200px; width: auto; object-fit: contain;">`
        : `<span style="color: ${primaryColor}">${project.name}</span>`;

      // ─── FINAL BRANDING INJECTION ───
      const themeData = project.websiteProfile?.theme || project.scrapedData?.theme || {};
      const fontsData = project.websiteProfile?.fonts || project.scrapedData?.fonts || {};

      const headerBg = themeData.header?.background || "#ffffff";
      const headerText = themeData.header?.text || "var(--text-dark, #1f1f1f)";
      const footerBg = themeData.footer?.background || "#111111";
      const footerText = themeData.footer?.text || "rgba(255, 255, 255, 0.7)";

      const btnPrimaryBg = themeData.buttons?.primaryBg || "var(--primary)";
      const btnPrimaryText = themeData.buttons?.primaryText || "#ffffff";
      const btnSecondaryBg = themeData.buttons?.secondaryBg || "transparent";
      const btnSecondaryText = themeData.buttons?.secondaryText || "var(--text-dark, #1f1f1f)";

      const bodyFont = fontsData.bodyFont ? `'${fontsData.bodyFont}', sans-serif` : "var(--font-body-md, 'Inter', sans-serif)";
      const headingFont = fontsData.headingFont ? `'${fontsData.headingFont}', serif` : "var(--font-h1, 'DM Serif Display', serif)";

      const brandingCss = `
:root, body {
  --primary: ${primaryColor || "#6366f1"};
  --secondary: ${secondaryColor || "#4f46e5"};
  --primary-rgb: ${hexToRgbStr(primaryColor || "#6366f1")};
  --secondary-rgb: ${hexToRgbStr(secondaryColor || "#4f46e5")};
  
  --header-bg: ${headerBg};
  --header-text: ${headerText};
  --footer-bg: ${footerBg};
  --footer-text: ${footerText};
}

body, p, a, span, li, input, select, textarea { font-family: ${bodyFont} !important; }
h1, h2, h3, h4, h5, h6, .font-h1, .font-h2, .font-h3 { font-family: ${headingFont} !important; }

/* Only override header/footer colors if they don't explicitly rely on var(--primary) */
.header, header, .site-header, .p3-site-header { background-color: var(--header-bg); color: var(--header-text); }
.header a, header a, .site-header a, .nav-menu a { color: var(--header-text); }

.footer, footer, .site-footer { background-color: var(--footer-bg); color: var(--footer-text); }
.footer p, footer p, .footer a, footer a, .site-footer p, .site-footer a, .footer-bottom p { color: var(--footer-text); }
.footer-title { color: var(--footer-text); opacity: 0.9; }

/* Removed forceful button overrides so the template's var(--primary) handles the UI selected color naturally */
`;
      enrichedStyles = brandingCss + "\n" + enrichedStyles;

      enrichedContent = enrichedContent.replace(/LOGO_PLACEHOLDER/g, logoHtml);
      enrichedContent = enrichedContent.replace(/PROJECT_NAME_PLACEHOLDER/g, project.name);
      enrichedContent = enrichedContent.replace(/CONTACT_PLACEHOLDER/g, getProjectPhone(project));
      enrichedContent = enrichedContent.replace(/PHONE_PLACEHOLDER/g, getProjectPhone(project));
      enrichedContent = enrichedContent.replace(/EMAIL_PLACEHOLDER/g, getProjectEmail(project));
      enrichedContent = enrichedContent.replace(/ADDRESS_PLACEHOLDER/g, getProjectAddress(project));


      // Replace any remaining placeholders in content (just in case) with CSS variables to keep them dynamic
      enrichedContent = enrichedContent.replace(/PRIMARY_COLOR_PLACEHOLDER/g, 'var(--primary)');
      enrichedContent = enrichedContent.replace(/SECONDARY_COLOR_PLACEHOLDER/g, 'var(--secondary)');
      enrichedContent = enrichedContent.replace(/PRIMARY_RGB_PLACEHOLDER/g, hexToRgbStr(primaryColor || "#6366f1"));
      enrichedContent = enrichedContent.replace(/SECONDARY_RGB_PLACEHOLDER/g, hexToRgbStr(secondaryColor || "#4f46e5"));

      // Clean up placeholders in styles
      // 1. Replace the actual variable definitions in :root first with the HEX values for base to avoid circular references
      // But for template specific variables, map them to var(--primary) so they sync with the editor
      enrichedStyles = enrichedStyles
        .replace(/--primary\s*:\s*PRIMARY_COLOR_PLACEHOLDER/g, `--primary: ${primaryColor || "#6366f1"}`)
        .replace(/--secondary\s*:\s*SECONDARY_COLOR_PLACEHOLDER/g, `--secondary: ${secondaryColor || "#4f46e5"}`)
        .replace(/--primary-rgb\s*:\s*PRIMARY_RGB_PLACEHOLDER/g, `--primary-rgb: ${hexToRgbStr(primaryColor || "#6366f1")}`)
        .replace(/--secondary-rgb\s*:\s*SECONDARY_RGB_PLACEHOLDER/g, `--secondary-rgb: ${hexToRgbStr(secondaryColor || "#4f46e5")}`);

      // 2. Replace any other placeholders in styles with CSS variables to keep them dynamic
      enrichedStyles = enrichedStyles
        .replace(/PRIMARY_COLOR_PLACEHOLDER/g, 'var(--primary)')
        .replace(/SECONDARY_COLOR_PLACEHOLDER/g, 'var(--secondary)')
        .replace(/PRIMARY_RGB_PLACEHOLDER/g, 'var(--primary-rgb)')
        .replace(/SECONDARY_RGB_PLACEHOLDER/g, 'var(--secondary-rgb)')
        .replace(/LOGO_URL_PLACEHOLDER/g, finalLogo || "");

      // 1. Extract proper valid keywords for title and text
      const industryText = getProjectIndustry(project);
      const subIndustryText = getProjectSubIndustry(project);
      const pageTitle = project.name ? `${project.name} - ${industryText}` : `${industryText} ${subIndustryText} Services`;

      // 2. IMPORTANT: Leave Unsplash and template asset image placeholders intact!
      // The backend's Getimg.ai API will automatically replace them based on industry/sub-industry.

      // 3. Intelligently inject scraped data using the helper
      const _mergedProject = { ...project, scrapedData: getProjectScrapedData(project), description: getProjectDescription(project) };
      enrichedContent = injectScrapedDataIntoTemplate(enrichedContent, _mergedProject, pageTitle, subIndustryText, finalLogo);

      // 5. Light/Dark Text Contrast adjustment script (auto-adapts text color based on background image brightness)
      const colorScript = `
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const checkBrightnessAndAdjust = () => {
            const sections = document.querySelectorAll('section, div, header');
            sections.forEach(sec => {
              const bgImg = window.getComputedStyle(sec).backgroundImage;
              if (bgImg && bgImg !== 'none' && bgImg.includes('url')) {
                const urlMatch = bgImg.match(/url\\(['"]?(.*?)['"]?\\)/);
                if (urlMatch && urlMatch[1]) {
                  const img = new Image();
                  img.crossOrigin = 'Anonymous';
                  img.src = urlMatch[1];
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if(!ctx) return;
                    ctx.drawImage(img, 0, 0);
                    try {
                      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                      let r=0, g=0, b=0;
                      const step = 4 * 10;
                      let count = 0;
                      for (let i = 0; i < data.length; i += step) {
                        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
                      }
                      if (count > 0) {
                        r = Math.floor(r / count);
                        g = Math.floor(g / count);
                        b = Math.floor(b / count);
                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                        const textColor = brightness < 128 ? '#ffffff' : '#000000';
                        sec.style.color = textColor;
                        const texts = sec.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
                        texts.forEach(t => t.style.color = textColor);
                      }
                    } catch(e) { }
                  };
                }
              }
            });
          };
          checkBrightnessAndAdjust();
          setTimeout(checkBrightnessAndAdjust, 1000);
        });
      <\/script>
      `.replace('<\\/script>', '</script>');

      // Inject script
      enrichedContent += colorScript;

      // We only send the aiPrompt for template enrichment if the user has modified it from the default.
      // Otherwise, we clear it to avoid triggering the backend AI service.
      const defaultTplPrompt = LANDING_TEMPLATES.find(t => t.id === selectedTemplate)?.prompt || "";
      const isPromptModified = aiPrompt.trim() !== defaultTplPrompt.trim();

      // Build a complete standalone HTML document for the template.
      // This ensures CSS, JS, and interactive features (FAQ accordion, etc.) work after publish.
      const primaryCol = primaryColor || "#6366f1";
      const secondaryCol = secondaryColor || "#4f46e5";
      const faviconUrl = project?.websiteProfile?.identity?.favicon || project?.scrapedData?.favicon;
      const fullTemplateHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${pageName.trim() || project.name}</title>
  <meta name="description" content="${project.description || ''}"/>${faviconUrl ? `\n  <link rel="icon" href="${faviconUrl}"/>` : ''}
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{primary:'${primaryCol}',secondary:'${secondaryCol}'}}}}</script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"/>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;600;700&family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet"/>
  ${fontsData?.googleFonts?.length ? `<link href="https://fonts.googleapis.com/css2?family=${fontsData.googleFonts.map(f => f.replace(/ /g, '+')).join('&family=')}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>` : ''}
  <style>
    :root{--primary:${primaryCol};--secondary:${secondaryCol};--accent:${secondaryCol};--gold:${primaryCol};--forest:${primaryCol};--btn-bg:${primaryCol};--btn-text:#ffffff;--button-gradient:linear-gradient(135deg,${primaryCol},${secondaryCol});}
    *,*::before,*::after{box-sizing:border-box;}html,body{margin:0;padding:0;min-height:100vh;}
    ${enrichedStyles}
  </style>
</head>
<body>
${enrichedContent}
</body>
</html>`;

      // Always use the newly enriched content so all dynamic placeholders, themes, and logic take effect
      const finalHtml = enrichedContent;
      basePayload = {
        name: pageName.trim(),
        slug: pageSlug.trim() || autoSlug(pageName),
        metaTitle: `${project.name} - ${pageName.trim()}`,
        metaDescription: getProjectDescription(project) || `Premium ${pageName.trim()} services by ${project.name}.`,
        generationMethod: "template",
        // Store as object with fullHtml so editor and publisher both work correctly
        content: { fullHtml: fullTemplateHtml, html: finalHtml, fullCss: enrichedStyles },
        styles: enrichedStyles,
        // Also store as landingPageContent for the public page renderer
        landingPageContent: fullTemplateHtml,
        landingPageStyles: enrichedStyles,
        templateId: finalTemplateId,
        template: tName,
        aiPrompt: aiPrompt
      };
    } else {
      toast.error("Please select a template to continue.");
      setShowLoader(false);
      setIsComplete(false);
      return;
    }

    createPageMutation.mutate({
      ...basePayload,
      name: pageName.trim(),
      slug: pageSlug.trim() || basePayload.slug,
      noIndexNoFollow,
      primaryColor,
      secondaryColor,
      logoUrl: logoUrl || project?.websiteProfile?.identity?.logoUrl || project.logoUrl || project.scrapedData?.logo, // <-- Fix: ensure DB saves the scraped logo
      // Explicitly pass industry so imageGenerationService receives it for AI image prompts
      industry: project?.category || project?.industry || "Service",
      subIndustry: project?.subIndustry || project?.scrapedData?.subIndustry || "Services",
      aiPrompt: "",
      // Always use template generation on the frontend
      generationMethod: "template",
      accentColor: "#6366f1",
      type: "ppc",
      status: "draft",
    });
  };

  const handleLoaderFinished = () => {
    if (createdPage) {
      toast.success("Page generated successfully!");
      navigate(`/editor/${id}/${createdPage._id}`);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-white"><Loader2 className="h-8 w-8 animate-spin text-violet-600" /></div>;
  if (showLoader || createPageMutation.isPending) return <ModernLoader isComplete={isComplete} onFinished={handleLoaderFinished} />;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      {/* ══ TOP NAV ══ */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(`/dashboard/projects/${id}`)}
          className="h-8 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-gray-300">/</span>
        {project && (
          <span className="flex items-center gap-2 text-sm text-gray-400 truncate max-w-[160px]">
            {/* Favicon: use state to track load failure so Globe fallback renders correctly */}
            {!faviconBroken && (project.websiteProfile?.identity?.favicon || project.logoUrl) ? (
              <img
                src={project.websiteProfile?.identity?.favicon || project.logoUrl!}
                alt="favicon"
                className="h-6 w-6 rounded object-contain flex-shrink-0"
                onError={() => setFaviconBroken(true)}
              />
            ) : (
              <Globe className="h-6 w-6 flex-shrink-0 text-gray-400" />
            )}
            {project.name}
          </span>
        )}
        <span className="text-gray-300">/</span>
        <span className="text-sm font-semibold text-gray-800">Create New Page</span>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* LEFT PANEL */}
        <div className="flex flex-col overflow-y-auto border-r border-gray-100 transition-all duration-300 w-full md:w-[52%] lg:w-[55%]">
          <div className="px-4 pt-10 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-black text-gray-900">Create New Page</h1>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details, pick a method, generate.</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-7 space-y-7">
            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Page Identity</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Page Name *</label>
                  <input
                    value={pageName}
                    onChange={(e) => {
                      setPageName(e.target.value);
                      const generated = autoSlug(e.target.value);
                      setPageSlug(generated);
                      // Clear validation states as the user is actively typing
                      setIsSlugVerified(false);
                      setSlugError("");
                    }}
                    onBlur={handlePageNameBlur}
                    placeholder="e.g. Roofing Delhi"
                    className={`w-full h-11 border rounded-xl px-4 text-sm outline-none transition-all ${pageNameError
                      ? 'border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                      : 'border-gray-200 bg-gray-50 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100'
                      }`}
                  />
                  {pageNameError && (
                    <span className="text-red-500 text-xs mt-1 block">{pageNameError}</span>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-1.5 block">URL Slug</label>
                  <div className={`flex items-center h-11 border rounded-xl overflow-hidden transition-all ${slugError
                    ? 'border-red-500 bg-red-50/10 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100'
                    : isSlugVerified
                      ? 'border-emerald-500 bg-emerald-50/10 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100'
                      : 'border-gray-200 bg-gray-50 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100'
                    }`}>
                    <span className="px-3 h-full flex items-center bg-gray-100 text-xs font-bold text-gray-500 border-r border-gray-200 whitespace-nowrap">/</span>
                    <input
                      value={pageSlug}
                      onChange={(e) => {
                        setPageSlug(autoSlug(e.target.value));
                        // Clear validation states as the user is actively typing
                        setIsSlugVerified(false);
                        setSlugError("");
                      }}
                      onBlur={handleSlugBlur}
                      placeholder="roofing-delhi"
                      className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
                    />
                    <div className="flex items-center gap-1.5 px-3 flex-shrink-0">
                      {isVerifyingSlug && (
                        <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                      )}
                      {!isVerifyingSlug && isSlugVerified && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                  {slugError && (
                    <span className="text-red-500 text-xs mt-1 block">{slugError}</span>
                  )}
                </div>
              </div>
              <div
                onClick={() => setNoIndexNoFollow(!noIndexNoFollow)}
                className={`mt-4 flex items-center justify-between border ${noIndexNoFollow ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-gray-50'} rounded-xl px-4 py-3 cursor-pointer transition-all hover:border-violet-300`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hide from Search Engines</p>
                  <p className="text-xs text-gray-500 mt-0.5">Set page as "No index, No follow"</p>
                </div>
                <div className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out ${noIndexNoFollow ? 'bg-violet-600' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${noIndexNoFollow ? 'translate-x-4' : 'translate-x-1'}`} />
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Branding</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold flex items-center gap-1.5">
                    Primary
                    {/* {isColorsFromLogo && project?.websiteProfile?.logoColors?.primary && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-violet-50 text-violet-600 border border-violet-200 rounded-full px-1.5 py-px">
                        <svg width="6" height="6" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
                        From Logo
                      </span>
                    )} */}
                  </p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <PickrColorInput value={primaryColor} onChange={(val) => setPrimaryColor(val)} className="absolute inset-0 w-full h-full opacity-0" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm" style={{ background: primaryColor }} />
                    <span className="text-xs font-mono text-gray-500 uppercase">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold flex items-center gap-1.5">
                    Secondary
                    {/* {isColorsFromLogo && project?.websiteProfile?.logoColors?.secondary && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-violet-50 text-violet-600 border border-violet-200 rounded-full px-1.5 py-px">
                        <svg width="6" height="6" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
                        From Logo
                      </span>
                    )} */}
                  </p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 relative">
                    <PickrColorInput value={secondaryColor} onChange={(val) => setSecondaryColor(val)} className="absolute inset-0 w-full h-full opacity-0" />
                    <div className="h-5 w-5 rounded-full border border-gray-200 shadow-sm" style={{ background: secondaryColor }} />
                    <span className="text-xs font-mono text-gray-500 uppercase">{secondaryColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-600 mb-1 font-semibold">Logo</p>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all">
                    {logoPreview ? (
                      <span className={`h-5 w-5 rounded-lg flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-slate-600 ${logoPreviewBgClass}`}>
                        <img src={normalizeLogoUrl(logoPreview) || logoPreview} alt="Logo" className="h-full w-full object-contain" onLoad={(e) => handleLogoPreviewImageLoad(e.currentTarget)} onError={(e) => {
                          const currentSrc = e.currentTarget.src || '';
                          if (currentSrc.startsWith('http') && !currentSrc.includes('/proxy-image')) {
                            e.currentTarget.src = aiApi.proxyImage(logoPreview!);
                            return;
                          }
                          e.currentTarget.style.display = 'none';
                        }} />
                      </span>
                    ) : (
                      <Upload className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-500">{logoPreview ? "Change" : "Upload"}</span>
                  </label>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Creation Method</p>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                {[
                  { key: "ai" as const, label: "✨ Describe with AI", icon: <Brain className="h-3.5 w-3.5" /> },
                  { key: "template" as const, label: "🗂️ Template", icon: <LayoutTemplate className="h-3.5 w-3.5" /> },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMethod(m.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeMethod === m.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>
            </section>

            {activeMethod === "ai" && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Describe your page *</label>
                  <button
                    onClick={handleGenerateMagicPrompt}
                    disabled={!pageName.trim() || isGeneratingPrompt}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg px-2.5 py-1 transition-all disabled:opacity-40"
                  >
                    {isGeneratingPrompt ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} ✨ Magic Write
                  </button>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => { setAiPrompt(e.target.value); if (e.target.value.trim()) setMethodError(""); }}
                  placeholder="e.g. PPC landing page for a roofing company in Delhi targeting homeowners who need emergency roof repairs. Include trust badges, before/after photos, a quote form and real testimonials..."
                  className={`w-full min-h-[150px] border rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none ${methodError && activeMethod === 'ai'
                    ? 'border-red-400 bg-red-50/20 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-gray-200 bg-gray-50 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100'
                    }`}
                />
                {methodError && activeMethod === 'ai' && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠️</span> {methodError}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  💡 <strong>Tip:</strong> The more detail you provide (industry, audience, services, tone), the better Claude generates your page.
                </p>
              </section>
            )}


            {activeMethod === "template" && (
              <section className="space-y-3">
                {selectedTemplate ? (
                  <>
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <p className="text-sm font-semibold text-emerald-700">
                        Template: {LANDING_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                      </p>
                      {project && <AiGenerateButton industry={getProjectIndustry(project)} />}
                      <button onClick={() => { setSelectedTemplate(null); setAiPrompt(""); }} className="ml-auto text-emerald-500 hover:text-emerald-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <LayoutTemplate className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-gray-500">Select a template from the right panel →</p>
                  </div>
                )}
              </section>
            )}

            <div className="flex gap-3 pt-2 pb-6">
              <button onClick={() => navigate(`/dashboard/projects/${id}`)} className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 font-semibold transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createPageMutation.isPending || !pageName.trim() || (activeMethod === 'ai' && !aiPrompt.trim()) || (activeMethod === 'template' && !selectedTemplate)}
                className="flex-[2] h-12 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {createPageMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate with AI</>}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────── RIGHT PANEL ─────────────────────────────── */}
        <div className="hidden md:flex flex-col w-1/2 bg-gray-50 overflow-y-auto border-l border-gray-100">
          {activeMethod === 'ai' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="px-4 pt-10 pb-5 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Prompt Inspiration</p>
                <p className="text-sm text-gray-500 mt-0.5">Click a preset to instantly build your landing page</p>
              </div>
              <div className="flex-1 px-4 py-4 flex flex-col gap-4">
                {[

                  { title: "Local Business Lead Gen", desc: "Optimized for roofing, plumbing, or dental services.", color: "bg-emerald-50 text-emerald-600", icon: <MapPin className="h-4 w-4" />, prompt: "PPC landing page for a local roofing company. High-visibility phone number, service area map, 'Get a Quote' form above the fold, and client testimonials." },
                  { title: "Digital Agency Portfolio", desc: "Showcase creative work and service packages.", color: "bg-violet-50 text-violet-600", icon: <Eye className="h-4 w-4" />, prompt: "Luxury digital agency landing page. Dark theme with neon accents, project gallery slider, service list with hover effects, and a team introduction section." },
                  { title: "Real Estate Showcase", desc: "Display properties with high-quality imagery.", color: "bg-amber-50 text-amber-600", icon: <LayoutTemplate className="h-4 w-4" />, prompt: "Premium real estate landing page. Hero image of a luxury apartment, property feature list (sqft, beds, baths), interactive map, and an inquiry form for agents." }
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAiPrompt(preset.prompt);
                      toast.success(`Loaded ${preset.title} preset`);
                    }}
                    className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-violet-400 hover:shadow-lg transition-all text-left flex gap-4 group"
                  >
                    <div className={`h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center ${preset.color}`}>
                      {preset.icon || <Sparkles className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-violet-600 transition-colors">{preset.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{preset.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMethod === 'figma' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              <div className="px-7 pt-10 pb-5 border-b border-gray-100">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Design to Code Tips</p>
                <p className="text-sm text-gray-500 mt-0.5">Best practices for Figma and Image uploads</p>
              </div>
              <div className="flex-1 px-10 py-12 flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                  <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200">
                    <Figma className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                </div>

                <div className="max-w-xs space-y-4">
                  <h3 className="text-lg font-black text-gray-900">How it works</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Our AI analyzes your design image or Figma export and converts it into a clean, responsive Tailwind CSS landing page.
                  </p>
                </div>

                <div className="w-full space-y-3">
                  {[
                    "Use high-resolution screenshots",
                    "Ensure text is clearly legible",
                    "Avoid overlapping complex elements",
                    "Keep layout hierarchy standard"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 text-left">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full">
                    Average processing time: 45s
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeMethod === 'template' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-5 duration-300">
              {/* Search and Category Filter */}
              <div className="px-6 pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative group flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-violet-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-gray-400 text-gray-800"
                    />
                  </div>

                  <button
                    onClick={() => setVisibleCount(visibleCount === 4 ? LANDING_TEMPLATES.length : 4)}
                    className="whitespace-nowrap px-6 py-3.5 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 flex items-center gap-2 shrink-0 animate-in fade-in slide-in-from-right-2"
                  >
                    <LayoutTemplate className="h-3.5 w-3.5" />
                    {visibleCount === 4 ? "View More" : "View Less"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {TEMPLATE_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${templateCategory === cat
                        ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-100"
                        : "bg-white border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Grid */}
              <div className="flex-1 px-6 py-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {LANDING_TEMPLATES
                    .filter(t => (templateCategory === "All" || t.tag === templateCategory) && (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tag.toLowerCase().includes(searchQuery.toLowerCase())))
                    .slice(0, visibleCount)
                    .map((tpl, idx) => (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          handleTemplateSelect(tpl);
                        }}
                        className={`cursor-pointer relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left ${selectedTemplate === tpl.id
                          ? "border-violet-500 shadow-lg shadow-violet-100 scale-[1.02]"
                          : "border-transparent hover:border-gray-300 hover:shadow-md hover:scale-[1.01]"
                          }`}
                      >
                        {/* Image / Gradient placeholder */}
                        <div
                          className="w-full aspect-[4/4] relative overflow-hidden"
                          style={{ background: tpl.gradient }}
                        >
                          {tpl.img ? (
                            <div className="absolute inset-0 w-full h-full overflow-y-hidden group-hover:overflow-y-auto custom-scrollbar">
                              <img
                                src={tpl.img}
                                alt={tpl.name}
                                className="w-full h-auto"
                              />
                            </div>
                          ) : (
                            /* Placeholder mockup shapes */
                            <div className="absolute inset-0 p-4 flex flex-col gap-2 opacity-30">
                              <div className="w-full h-4 bg-white rounded-md" />
                              <div className="w-3/4 h-3 bg-white rounded-md" />
                              <div className="w-1/2 h-3 bg-white rounded-md" />
                              <div className="flex gap-2 mt-2">
                                <div className="w-16 h-7 bg-white rounded-lg" />
                                <div className="w-14 h-7 bg-white/50 rounded-lg" />
                              </div>
                              <div className="flex-1 grid grid-cols-3 gap-2 mt-2">
                                <div className="bg-white/40 rounded-xl" />
                                <div className="bg-white/40 rounded-xl" />
                                <div className="bg-white/40 rounded-xl" />
                              </div>
                              <div className="w-full h-8 bg-white/30 rounded-lg mt-1" />
                            </div>
                          )}

                          {/* Selected overlay */}
                          {selectedTemplate === tpl.id && (
                            <div className="absolute inset-0 bg-violet-900/20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-1.5 shadow-xl">
                                <CheckCircle2 className="h-5 w-5 text-violet-600" />
                              </div>
                            </div>
                          )}

                          <div className="absolute top-2.5 left-2.5 bg-gray-900 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-lg">
                            <span className="text-violet-400">{String(idx + 1).padStart(2, '0')}</span>
                            <span className="w-px h-2 bg-gray-700" />
                            <span className="uppercase tracking-wider">{tpl.tag}</span>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-center justify-between">
                          <span className="text-[11px] font-black text-gray-900 truncate pr-2">{tpl.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleViewTemplate(tpl); }}
                            className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                            title="View Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Template Preview Modal ── */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
            <div>
              <h3 className="text-white font-bold text-lg">{previewTemplate.name}</h3>
              <p className="text-white/50 text-xs uppercase tracking-widest font-black">{previewTemplate.tag} Template</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { handleTemplateSelect(previewTemplate); setPreviewTemplate(null); }}
                className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-violet-100 transition-all flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5" /> Use Template
              </button>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full bg-white relative">
            {(() => {
              let tpHtml = "";
              let tpStyles = "";
              switch (previewTemplate.id) {
                case "law-01": tpHtml = law01Html; tpStyles = law01Styles; break;
                case "law-02": tpHtml = law02Html; tpStyles = law02Styles; break;
                case "healthcare-01": tpHtml = healthcare01Html; tpStyles = healthcare01Styles; break;
                case "healthcare-02": tpHtml = healthcare02Html; tpStyles = healthcare02Styles; break;
                case "healthcare-03": tpHtml = healthcare03Html; tpStyles = healthcare03Styles; break;
                case "healthcare-04": tpHtml = healthcare04Html; tpStyles = healthcare04Styles; break;
                case "travel-01": tpHtml = travel01Html; tpStyles = travel01Styles; break;
                case "travel-02": tpHtml = travel02Html; tpStyles = travel02Styles; break;
                case "travel-03": tpHtml = travel03Html; tpStyles = travel03Styles; break;
                case "travel-04": tpHtml = travel04Html; tpStyles = travel04Styles; break;
                case "finance-01": tpHtml = finance01Html; tpStyles = finance01Styles; break;
                case "finance-02": tpHtml = finance02Html; tpStyles = finance02Styles; break;
                case "finance-03": tpHtml = finance03Html; tpStyles = finance03Styles; break;
                case "finance-04": tpHtml = finance04Html; tpStyles = finance04Styles; break;
                default: tpHtml = ""; tpStyles = "";
              }

              // ── Use actual project branding in preview ──
              const previewPrimary = primaryColor || "#6366f1";
              const previewSecondary = secondaryColor || "#4f46e5";
              const previewName = project?.name || "Your Brand";
              const previewLogo = logoUrl || getProjectLogoUrl(project);

              const brandingVars = `
                :root {
                  --primary: ${previewPrimary};
                  --secondary: ${previewSecondary};
                  --accent: ${previewSecondary};
                  --gold: ${previewPrimary};
                  --btn-bg: ${previewPrimary};
                  --btn-text: #ffffff;
                  --button-gradient: linear-gradient(135deg, ${previewPrimary}, ${previewSecondary});
                  --primary-rgb: ${hexToRgbStr(previewPrimary)};
                  --secondary-rgb: ${hexToRgbStr(previewSecondary)};
                }
              `;
              tpStyles = brandingVars + "\n" + tpStyles;

              // Replace ALL placeholders in CSS
              tpStyles = tpStyles
                .replace(/PRIMARY_COLOR_PLACEHOLDER/g, previewPrimary)
                .replace(/SECONDARY_COLOR_PLACEHOLDER/g, previewSecondary)
                .replace(/PRIMARY_RGB_PLACEHOLDER/g, hexToRgbStr(previewPrimary))
                .replace(/SECONDARY_RGB_PLACEHOLDER/g, hexToRgbStr(previewSecondary))
                .replace(/LOGO_URL_PLACEHOLDER/g, previewLogo || "");

              // Build logo HTML using project logo/name
              const logoHtml = previewLogo
                ? `<img src="${previewLogo}" alt="${previewName}" style="height:40px;width:auto;object-fit:contain;">`
                : `<span style="font-weight:800;font-size:1.4rem;color:${previewPrimary};">${previewName}</span>`;

              // Replace ALL placeholders in HTML using the helper
              const previewIndustryText = getProjectIndustry(project);
              const previewSubIndustryText = project?.subIndustry || project?.scrapedData?.subIndustry || "Services";
              const previewPageTitle = project?.name ? `${project.name} - ${previewIndustryText}` : `${previewIndustryText} ${previewSubIndustryText} Services`;
              const _mergedPreviewProject = project ? { ...project, scrapedData: getProjectScrapedData(project), description: getProjectDescription(project) } : project;
              tpHtml = injectScrapedDataIntoTemplate(tpHtml, _mergedPreviewProject, previewPageTitle, previewSubIndustryText, previewLogo);

              tpHtml = tpHtml
                .replace(/PROJECT_NAME_PLACEHOLDER/g, previewName)
                .replace(/LOGO_PLACEHOLDER/g, logoHtml)
                .replace(/CONTACT_PLACEHOLDER/g, getProjectPhone(project))
                .replace(/PHONE_PLACEHOLDER/g, project?.scrapedData?.phone || project?.phone || "+1 (800) 123-4567")
                .replace(/EMAIL_PLACEHOLDER/g, getProjectEmail(project))
                .replace(/ADDRESS_PLACEHOLDER/g, project?.scrapedData?.address || "123 Business Avenue, New York, NY")
                .replace(/PRIMARY_COLOR_PLACEHOLDER/g, previewPrimary)
                .replace(/SECONDARY_COLOR_PLACEHOLDER/g, previewSecondary)
                .replace(/PRIMARY_RGB_PLACEHOLDER/g, hexToRgbStr(previewPrimary))
                .replace(/SECONDARY_RGB_PLACEHOLDER/g, hexToRgbStr(previewSecondary));

              return (
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Preview — ${previewTemplate.name}</title>
                        <script src="https://cdn.tailwindcss.com"><\/script>
                        <script>
                          tailwind.config = { theme: { extend: { colors: { primary: '${previewPrimary}', secondary: '${previewSecondary}' } } } };
                        <\/script>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
                        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&display=swap" rel="stylesheet">
                        <style>
                          body { margin: 0; padding: 0; overflow-x: hidden; }
                          ${tpStyles}
                        </style>
                      </head>
                      <body>
                        ${tpHtml}
                      </body>
                    </html>
                  `}
                  className="absolute inset-0 w-full h-full border-none"
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePagePage;