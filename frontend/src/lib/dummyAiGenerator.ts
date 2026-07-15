export const generateDummyAiLayout = (prompt: string, projectName: string) => {
  const p = prompt || projectName || "Awesome Startup";
  const title = p.slice(0, 50).replace(/[^a-zA-Z0-9 ]/g, '');
  
  const html = `
<header class="ai-hero gjs-section" style="padding: 100px 20px; text-align: center; background-color: var(--primary); color: white;">
  <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 800;">${title} Solutions</h1>
  <p style="font-size: 1.2rem; max-width: 600px; margin: 0 auto 30px auto; opacity: 0.9;">Custom AI-generated layout based on: "${p}". We deliver exceptional services tailored to your needs.</p>
  <button style="padding: 15px 30px; font-size: 1.1rem; background-color: white; color: var(--primary); border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Get Started Now</button>
</header>
<section class="ai-features gjs-section" style="padding: 80px 20px; background-color: #f8fafc;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h2 style="text-align: center; font-size: 2.5rem; color: #1e293b; margin-bottom: 50px;">Why Choose Us</h2>
    <div style="display: flex; gap: 30px; flex-wrap: wrap; justify-content: center;">
      <div style="flex: 1; min-width: 300px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h3 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px;">Innovative Approach</h3>
        <p style="color: #475569; line-height: 1.6;">Our state-of-the-art methodology ensures the best results for your specific requirements.</p>
      </div>
      <div style="flex: 1; min-width: 300px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h3 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px;">Expert Team</h3>
        <p style="color: #475569; line-height: 1.6;">Work with industry professionals dedicated to bringing your vision to life.</p>
      </div>
      <div style="flex: 1; min-width: 300px; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h3 style="font-size: 1.5rem; color: var(--primary); margin-bottom: 15px;">Tailored For You</h3>
        <p style="color: #475569; line-height: 1.6;">Every detail of this page was conceptually generated based on your input.</p>
      </div>
    </div>
  </div>
</section>
<section class="ai-contact gjs-section" style="padding: 80px 20px; text-align: center; background-color: white;">
  <h2 style="font-size: 2.5rem; color: #1e293b; margin-bottom: 20px;">Ready to Transform Your Business?</h2>
  <p style="color: #475569; max-width: 600px; margin: 0 auto 40px auto;">Contact us today to learn more about how we can help you achieve your goals.</p>
  <form style="max-width: 500px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
    <input type="text" placeholder="Your Name" style="padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem;">
    <input type="email" placeholder="Email Address" style="padding: 12px 15px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem;">
    <button type="submit" style="padding: 15px; font-size: 1.1rem; background-color: var(--primary); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Submit Request</button>
  </form>
</section>
  `;
  
  const css = `
    body { font-family: 'Inter', sans-serif; }
    .ai-hero { transition: all 0.3s ease; }
    .ai-hero:hover { filter: brightness(1.05); }
    .ai-features > div > div { transition: transform 0.3s ease; }
    .ai-features > div > div:hover { transform: translateY(-5px); }
  `;
  
  return { html, css };
};
