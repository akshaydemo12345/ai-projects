import { Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", clients: "", comments: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Get Started Today!</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Ready to build your next landing page? Fill out the form and our team will get you set up in no time. Whether you're a solopreneur or an agency, we've got the perfect plan for you.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" /> hello@pagecraft.ai
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-5 w-5 text-primary" /> www.pagecraft.ai
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div>
              <label className="text-sm font-medium text-foreground">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Phone *</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">No of Clients *</label>
              <Input value={form.clients} onChange={(e) => setForm({ ...form, clients: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Comments</label>
              <Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} className="mt-1" rows={3} />
            </div>
            <p className="text-xs text-muted-foreground">We will never spam you or sell your email to third parties.</p>
            <Button type="submit" className="w-full">Apply Now</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
