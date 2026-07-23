/**
 * aiSimulation.ts
 * 
 * ⚠️ ALL HARDCODED MOCK SECTIONS REMOVED.
 * 
 * The old MOCK_SECTIONS had a fixed: hero → 3 feature cards → testimonials → CTA
 * which caused every page to look identical. That is now gone.
 * 
 * Real generation is done by the backend AI (aiService.js) which:
 * - Uses a chaos token (timestamp + random + business hash) as a creative seed
 * - Randomly picks from 15 style directions (glassmorphism, editorial, brutalist, etc.)
 * - Bans specific repeating patterns via the system prompt
 * - Invents a unique layout concept per generation
 */

import { type Project } from "../services/api";

// ─── Kept only for import compatibility ───
export const AI_MOCK_PROMPTS = [
  "Design a landing page for {name} in the {industry} space that is completely unique.",
  "Create a premium conversion page for {name} — no generic templates allowed.",
  "Build a high-impact {industry} landing page for {name} that wins Awwwards.",
  "Generate an industry-specific, visually dramatic page for {name}'s {industry} services.",
];

/**
 * @deprecated MOCK_SECTIONS removed — was causing identical layouts every time.
 * Use backend aiService.generateLandingPageContent() instead.
 */
export const MOCK_SECTIONS = {} as const;

/**
 * Generates a chaos-seeded placeholder for fallback scenarios.
 * In normal flow, this is never called — backend AI handles everything.
 */
export function generateSimulatedPage(_prompt: string, project: Project, branding: any) {
  const name = project.name || "My Business";
  const industry = project.category || "Service";
  const chaos = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  return {
    content: `
      <!-- CHAOS: ${chaos} — AI backend unavailable, showing placeholder -->
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f172a,#1e1b4b);font-family:system-ui,sans-serif;padding:40px 20px;text-align:center;">
        <div style="max-width:640px;color:#fff;">
          <div style="width:64px;height:64px;background:linear-gradient(135deg,${branding?.primary||'#7c3aed'},${branding?.secondary||'#6366f1'});border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 24px;">✨</div>
          <h1 style="font-size:42px;font-weight:800;margin:0 0 16px;background:linear-gradient(135deg,#fff,#a5b4fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${name}</h1>
          <p style="font-size:18px;color:rgba(255,255,255,0.7);margin:0 0 32px;line-height:1.7;">Your AI-powered ${industry} landing page is being crafted. Please wait while we generate your unique design.</p>
          <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:20px 24px;font-size:13px;color:rgba(255,255,255,0.5);">AI Generation Token: ${chaos}</div>
        </div>
      </div>
    `,
    styles: `
      :root {
        --primary: ${branding?.primary || '#7c3aed'};
        --secondary: ${branding?.secondary || '#6366f1'};
      }
    `
  };
}
