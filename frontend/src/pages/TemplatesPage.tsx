import { Search, Eye, ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { healthcare01Html, healthcare01Styles } from "../templates/healthcare/templates01";
import { healthcare02Html, healthcare02Styles } from "../templates/healthcare/templates02";
import { healthcare03Html, healthcare03Styles } from "../templates/healthcare/templates03";
import { healthcare04Html, healthcare04Styles } from "../templates/healthcare/templates04";
import { travel01Html, travel01Styles } from "../templates/travel/templates01";
import { travel02Html, travel02Styles } from "../templates/travel/templates02";
import { travel03Html, travel03Styles } from "../templates/travel/templates03";
import { finance01Html, finance01Styles } from "../templates/finance/templates01";
import { finance02Html, finance02Styles } from "../templates/finance/templates02";
import { law01Html, law01Styles } from "../templates/law/templates01";
import { law02Html, law02Styles } from "../templates/law/templates02";
import { law03Html, law03Styles } from "../templates/law/templates03";
import { law04Html, law04Styles } from "../templates/law/templates04";
import { law05Html, law05Styles } from "../templates/law/templates05";
import { law06Html, law06Styles } from "../templates/law/templates06";
import { travel04Html, travel04Styles } from "../templates/travel/templates04";
import { finance03Html, finance03Styles } from "../templates/finance/templates03";
import { plumber01Html, plumber01Styles } from "../templates/plumber/templates01";
import { plumber02Html, plumber02Styles } from "../templates/plumber/templates02";
import { plumber03Html, plumber03Styles } from "../templates/plumber/templates03";
import { plumber04Html, plumber04Styles } from "../templates/plumber/templates04";

import { realEstate01Html, realEstate01Styles } from "../templates/real-estate/templates01";
import { realEstate02Html, realEstate02Styles } from "../templates/real-estate/templates02";
import { realEstate03Html, realEstate03Styles } from "../templates/real-estate/templates03";
import { realEstate04Html, realEstate04Styles } from "../templates/real-estate/templates04";
import { realEstate05Html, realEstate05Styles } from "../templates/real-estate/templates05";
import { realEstate06Html, realEstate06Styles } from "../templates/real-estate/templates06";
import { realEstate07Html, realEstate07Styles } from "../templates/real-estate/templates07";
import { realEstate08Html, realEstate08Styles } from "../templates/real-estate/templates08";
import { realEstate09Html, realEstate09Styles } from "../templates/real-estate/templates09";
import { realEstate10Html, realEstate10Styles } from "../templates/real-estate/templates10";


const LANDING_TEMPLATES = [
  {
    id: "law-01",
    name: "Justice Law Firm",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/screenshot.png",
    gradient: "linear-gradient(135deg, #7A28F5 0%, #4615b2 100%)",
  },
  {
    id: "law-02",
    name: "Justice Law Firm",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/templates02/lov02.png",
    gradient: "linear-gradient(135deg, #7A28F5 0%, #4615b2 100%)",
  },
  {
    id: "law-03",
    name: "Justice Elite",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/templates03/screenshot.png",
    gradient: "linear-gradient(135deg, #0A1118 0%, #D4AF37 100%)",
  },
  {
    id: "law-04",
    name: "Justice Supreme",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/screenshot04.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
  },
  {
    id: "law-05",
    name: "Lawyer Base",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/screenshot05.png",
    gradient: "linear-gradient(135deg, #111111 0%, #b79b6c 100%)",
  },
  {
    id: "law-06",
    name: "Ashcroft & Vale",
    tag: "Law Firm",
    img: "/assets/templates/LawFirm/templates06/screenshot.png",
    gradient: "linear-gradient(135deg, #0c1426 0%, #C8A15A 100%)",
  },
  {
    id: "healthcare-01",
    name: "Lumina Dental",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates01/dental-screenshot-01.png",
    gradient: "linear-gradient(135deg, #bb0014 0%, #141d23 100%)",
  },
  {
    id: "healthcare-02",
    name: "Elite Healthcare",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates02/screnshort81.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #38bdf8 100%)",
  },
  {
    id: "healthcare-03",
    name: "Lumina Medical Center",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates03/screnshort82.png",
    gradient: "linear-gradient(135deg, #00d2f3 0%, #5b5ef0 100%)",
  },
  {
    id: "healthcare-04",
    name: "Medlio Healthcare",
    tag: "Healthcare",
    img: "/assets/templates/healthcare/templates04/H1.png",
    gradient: "linear-gradient(135deg, #1750A8 0%, #e6f2ff 100%)",
  },
  {
    id: "travel-01",
    name: "Azure Luxury Escapes",
    tag: "Travel",
    img: "/assets/templates/travel/templates01/newpd.png",
    gradient: "linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)",
  },
  {
    id: "travel-02",
    name: "Savanna Safari Elite",
    tag: "Travel",
    img: "/assets/templates/travel/templates02/screenshot3.png",
    gradient: "linear-gradient(135deg, #78350f 0%, #1c1917 100%)",
  },
  {
    id: "travel-03",
    name: "Etheria Journeys",
    tag: "Travel",
    img: "/assets/templates/travel/templates03/screenshot2.png",
    gradient: "linear-gradient(135deg, #0a1128 0%, #c5a059 100%)",
  },
  {
    id: "travel-04",
    name: "Metro City Explorer",
    tag: "Travel",
    img: "/assets/templates/travel/templates04/screenshot4.png",
    gradient: "linear-gradient(135deg, #111827 0%, #374151 100%)",
  },
  {
    id: "finance-01",
    name: "Elite Wealth",
    tag: "Finance",
    img: "/assets/templates/finance/templates01/screenshot.png",
    gradient: "linear-gradient(135deg, #2b5cff 0%, #1f3aa6 100%)",
  },
  {
    id: "finance-02",
    name: "Finance Elite 02",
    tag: "Finance",
    img: "/assets/templates/finance/templates02/screen.png",
    gradient: "linear-gradient(135deg, #0a192f 0%, #c5a059 100%)",
  },
  {
    id: "finance-03",
    name: "Finova Analytics",
    tag: "Finance",
    img: "/assets/templates/finance/templates04/screenshot.png",
    gradient: "linear-gradient(135deg, #0f172a 0%, #4f46e5 100%)",
  },
  {
    id: "plumber-01",
    name: "ProPlumb Solutions",
    tag: "Plumber",
    img: "/assets/templates/plumber/templates01/screenshot.png",
    gradient: "linear-gradient(135deg, #00479b 0%, #db313f 100%)",
  },
  {
    id: "plumber-02",
    name: "Elite Plumbing",
    tag: "Plumber",
    img: "/assets/templates/plumber/templates02/screenshot.png",
    gradient: "linear-gradient(135deg, #091d2d 0%, #49607e 100%)",
  },
  {
    id: "plumber-03",
    name: "Modern Plumber",
    tag: "Plumber",
    img: "/assets/templates/plumber/templates03/screenshot.png",
    gradient: "linear-gradient(135deg, #0c0f0d 0%, #a6e028 100%)",
  },
  {
    id: "plumber-04",
    name: "Modern Plumber 04",
    tag: "Plumber",
    img: "/assets/templates/plumber/templates04/screenshotp.png",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)"
  },
  {
    id: "realestate-01",
    name: "Luxury Estate",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate1.png",
    gradient: "linear-gradient(135deg, #1f2937 0%, #c5a059 100%)"
  },
  {
    id: "realestate-02",
    name: "Lumina Homes",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate2.png",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  },
  {
    id: "realestate-03",
    name: "Estate 03",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate3.png",
    gradient: "linear-gradient(135deg, #1f2937 0%, #c5a059 100%)"
  },
  {
    id: "realestate-04",
    name: "Agency 04",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate4.png",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  },
  {
    id: "realestate-05",
    name: "Estate 05",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate5.png",
    gradient: "linear-gradient(135deg, #1f2937 0%, #c5a059 100%)"
  },
  {
    id: "realestate-06",
    name: "Agency 06",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate6.png",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  },
  {
    id: "realestate-07",
    name: "Estate 07",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate7.png",
    gradient: "linear-gradient(135deg, #1f2937 0%, #c5a059 100%)"
  },
  {
    id: "realestate-08",
    name: "Agency 08",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate8.png",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  },
  {
    id: "realestate-09",
    name: "Estate 09",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate9.png",
    gradient: "linear-gradient(135deg, #1f2937 0%, #c5a059 100%)"
  },
  {
    id: "realestate-10",
    name: "Agency 10",
    tag: "Real Estate",
    img: "/assets/templates/realEstate/RealEstate10.png",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)"
  }
];

const TEMPLATE_CATEGORIES = ["All", "Real Estate", "Law Firm", "Healthcare", "Travel", "Finance", "Plumber"];

const getTemplateContent = (id: string) => {
  switch (id) {
    case "law-01": return { html: law01Html, css: law01Styles };
    case "law-02": return { html: law02Html, css: law02Styles };
    case "law-03": return { html: law03Html, css: law03Styles };
    case "law-04": return { html: law04Html, css: law04Styles };
    case "law-05": return { html: law05Html, css: law05Styles };
    case "law-06": return { html: law06Html, css: law06Styles };
    case "healthcare-01": return { html: healthcare01Html, css: healthcare01Styles };
    case "healthcare-02": return { html: healthcare02Html, css: healthcare02Styles };
    case "healthcare-03": return { html: healthcare03Html, css: healthcare03Styles };
    case "healthcare-04": return { html: healthcare04Html, css: healthcare04Styles };
    case "travel-01": return { html: travel01Html, css: travel01Styles };
    case "travel-02": return { html: travel02Html, css: travel02Styles };
    case "travel-03": return { html: travel03Html, css: travel03Styles };
    case "travel-04": return { html: travel04Html, css: travel04Styles };
    case "finance-01": return { html: finance01Html, css: finance01Styles };
    case "finance-02": return { html: finance02Html, css: finance02Styles };
    case "finance-03": return { html: finance03Html, css: finance03Styles };
    case "plumber-01": return { html: plumber01Html, css: plumber01Styles };
    case "plumber-02": return { html: plumber02Html, css: plumber02Styles };
    case "plumber-03": return { html: plumber03Html, css: plumber03Styles };
    case "plumber-04": return { html: plumber04Html, css: plumber04Styles };

    case "realestate-01": return { html: realEstate01Html, css: realEstate01Styles };
    case "realestate-02": return { html: realEstate02Html, css: realEstate02Styles };
    case "realestate-03": return { html: realEstate03Html, css: realEstate03Styles };
    case "realestate-04": return { html: realEstate04Html, css: realEstate04Styles };
    case "realestate-05": return { html: realEstate05Html, css: realEstate05Styles };
    case "realestate-06": return { html: realEstate06Html, css: realEstate06Styles };
    case "realestate-07": return { html: realEstate07Html, css: realEstate07Styles };
    case "realestate-08": return { html: realEstate08Html, css: realEstate08Styles };
    case "realestate-09": return { html: realEstate09Html, css: realEstate09Styles };
    case "realestate-10": return { html: realEstate10Html, css: realEstate10Styles };
    default: return { html: "", css: "" };
  }
};

const TemplatesPage = () => {
  const [templateCategory, setTemplateCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTpl, setPreviewTpl] = useState<typeof LANDING_TEMPLATES[0] | null>(null);

  const openPreview = (tpl: typeof LANDING_TEMPLATES[0]) => {
    const { html, css } = getTemplateContent(tpl.id);
    const PRIMARY = '#6366f1';
    const SECONDARY = '#4f46e5';

    const brandingVars = `
      :root {
        --primary: ${PRIMARY};
        --secondary: ${SECONDARY};
        --accent: ${SECONDARY};
        --gold: ${PRIMARY};
        --btn-bg: ${PRIMARY};
        --button-gradient: linear-gradient(135deg, ${PRIMARY}, ${SECONDARY});
      }
    `;

    let styledCss = brandingVars + '\n' + css
      .replace(/PRIMARY_COLOR_PLACEHOLDER/g, PRIMARY)
      .replace(/SECONDARY_COLOR_PLACEHOLDER/g, SECONDARY)
      .replace(/PRIMARY_RGB_PLACEHOLDER/g, '99, 102, 241')
      .replace(/SECONDARY_RGB_PLACEHOLDER/g, '79, 70, 229')
      .replace(/LOGO_URL_PLACEHOLDER/g, '');

    const logoHtml = `<span style="font-weight:800;font-size:1.4rem;color:${PRIMARY};">Your Brand</span>`;
    let styledHtml = html
      .replace(/PROJECT_NAME_PLACEHOLDER/g, 'Your Business')
      .replace(/LOGO_PLACEHOLDER/g, logoHtml)
      .replace(/CONTACT_PLACEHOLDER/g, 'Contact Us')
      .replace(/ADDRESS_PLACEHOLDER/g, '123 Business Avenue, Suite 100')
      .replace(/PHONE_PLACEHOLDER/g, '+1 (800) 123-4567')
      .replace(/EMAIL_PLACEHOLDER/g, 'contact@example.com')
      .replace(/PRIMARY_COLOR_PLACEHOLDER/g, PRIMARY)
      .replace(/SECONDARY_COLOR_PLACEHOLDER/g, SECONDARY)
      .replace(/PRIMARY_RGB_PLACEHOLDER/g, '99, 102, 241')
      .replace(/SECONDARY_RGB_PLACEHOLDER/g, '79, 70, 229');

    const scriptMatches = styledHtml.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
    const inlineScripts = scriptMatches
      .filter(s => !s.includes('cdn.tailwindcss.com') && !s.includes('tailwind.config'))
      .join('\n');

    const fullDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview — ${tpl.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>tailwind.config={theme:{extend:{colors:{primary:'${PRIMARY}',secondary:'${SECONDARY}'}}}}</script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,300&display=swap" rel="stylesheet">
          <style>
            body { margin: 0; padding: 0; overflow-x: hidden; }
            ${styledCss}
          </style>
        </head>
        <body>
          ${styledHtml}
          ${inlineScripts}
        </body>
      </html>
    `;

    localStorage.setItem('grapes-preview-html', fullDoc);
    window.open('/template-preview', '_blank');
  };


  const filtered = LANDING_TEMPLATES.filter(t =>
    (templateCategory === "All" || t.tag === templateCategory) &&
    (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="p-8 md:p-16">
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
          }
        `}</style>

        <div className="w-full max-w-[1600px] mx-auto space-y-12">
          {/* Header area with back button */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-violet-600 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>

          {/* Search and Category Filter */}
          <div className="space-y-8 w-full mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTemplateCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    templateCategory === cat
                      ? "bg-[#7c3aed] border-[#7c3aed] text-white shadow-md"
                      : "bg-white border-gray-100 text-gray-400 hover:text-gray-700 hover:border-gray-200 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative group max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-violet-500 transition-all duration-300" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-none rounded-2xl py-4 pl-14 pr-6 text-base font-medium outline-none shadow-sm focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-gray-300 text-gray-800"
              />
            </div>
          </div>

          {/* Grid Area */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((tpl, idx) => (
              <div
                key={tpl.id}
                className="relative group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 text-left p-3"
              >
                {/* Image / Gradient placeholder */}
                <div
                  className="w-full aspect-[4/3] relative rounded-xl overflow-hidden border border-gray-100"
                >
                  <div
                    className="w-full h-full overflow-hidden relative shadow-inner"
                    style={{ background: tpl.gradient }}
                  >
                    {tpl.img && (
                      <div className="absolute inset-0 w-full h-full overflow-y-hidden group-hover:overflow-y-auto custom-scrollbar transition-all duration-500">
                        <img
                          src={tpl.img}
                          alt={tpl.name}
                          className="w-full h-auto"
                        />
                      </div>
                    )}

                    <div className="absolute top-4 left-4 bg-[#0f172a]/90 backdrop-blur-xl text-white text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-2xl z-20 border border-white/10">
                      <span className="text-violet-400">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="w-px h-2.5 bg-gray-700/50" />
                      <span className="uppercase tracking-widest">{tpl.tag}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white px-2 pb-2 pt-4 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-gray-900 truncate pr-3 group-hover:text-violet-600 transition-colors duration-300">{tpl.name}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); openPreview(tpl); }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
                    title="View Preview"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-32">
              <p className="text-muted-foreground font-semibold text-xl opacity-40">No templates found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      
    </div>
  );
};

export default TemplatesPage;