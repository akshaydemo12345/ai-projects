import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">PageCraft</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              AI-powered landing page builder. Create beautiful, high-converting pages in seconds — no code required.
            </p>
            <div className="mt-4 flex gap-3">
              {["X", "LI", "GH"].map((s) => (
                <div key={s} className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground hover:bg-muted cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>
          {[
            { title: "Product", links: ["Features", "Pricing", "Templates", "Integrations", "Changelog"] },
            { title: "Resources", links: ["Documentation", "Blog", "Guides", "Help Center", "API"] },
            { title: "Company", links: ["About", "Careers", "Contact", "Privacy Policy", "Terms of Service"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 PageCraft AI. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Made with love for makers everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
