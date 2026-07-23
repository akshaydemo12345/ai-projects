const fs = require('fs');
const path = '/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/frontend/src/pages/CreatePagePage.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Change the AI Preset toast so it doesn't say "preset" or anything like "template"
code = code.replace(/toast\.success\(\`AI Prompt filled with \$\{preset\.title\} preset!\`\);/g, "toast.success(`Prompt populated with AI suggestion!`);");

// 2. Mock aiApi.generate inside handleCreate to just generate random static dummy content
// Find the block:
// const generationRes = await aiApi.generate({
//   ...
// });
// const aiResult = generationRes?.data?.content;

const aiGenerateRegex = /const generationRes = await aiApi\.generate\(\{[\s\S]*?\}\);\s*const aiResult = generationRes\?\.data\?\.content;/;
const mockCode = `
        // SIMULATED AI GENERATION FOR FRONTEND-ONLY APP
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const generatedSection1 = \`<section style="padding: 100px 20px; text-align: center; background: linear-gradient(135deg, \${primaryColor}, \${secondaryColor}); color: white;">
          <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 20px;">\${pageName.trim() || 'AI Generated Page'}</h1>
          <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto;">\${aiPrompt.trim()}</p>
        </section>\`;
        
        const generatedSection2 = \`<section style="padding: 80px 20px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: \${primaryColor};">Smart Features</h3>
            <p style="color: #64748b;">This content was dynamically generated based on your prompt to provide the best possible layout.</p>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: \${primaryColor};">High Conversion</h3>
            <p style="color: #64748b;">Optimized for lead generation and maximum user engagement across all devices.</p>
          </div>
        </section>\`;

        const aiResult = {
          fullHtml: \`<!DOCTYPE html><html><head><title>\${pageName}</title></head><body style="margin:0; font-family: sans-serif;">\${generatedSection1}\${generatedSection2}</body></html>\`,
          fullCss: ""
        };
`;
code = code.replace(aiGenerateRegex, mockCode);

fs.writeFileSync(path, code);
