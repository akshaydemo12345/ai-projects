import React, { useState } from "react";
import { Send, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { leadsApi } from "@/services/api";
import { toast } from "sonner";

interface LeadFormProps {
  projectId: string;
  pageSlug: string;
  pageId?: string;
  className?: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

/**
 * Premium Lead Capture Form
 * Production-ready with validation, loading states, and automatic context detection.
 */
const LeadForm: React.FC<LeadFormProps> = ({ 
  projectId, 
  pageSlug, 
  pageId,
  className = "", 
  onSuccess,
  title = "Get in Touch",
  description = "Fill out the form below and we will get back to you shortly."
}) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Security/Validation
    const { name, email, phone } = formData;
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide at least your name and email.");
      return;
    }

    setLoading(true);
    try {
      await leadsApi.create({
        ...formData,
        projectId,
        pageSlug,
        pageId,
      });

      setSubmitted(true);
      toast.success("Enquiry submitted successfully!");
      if (onSuccess) onSuccess();
      
      // Auto-reset after some time
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 5000);

    } catch (error: any) {
      toast.error(error.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`p-8 rounded-2xl border-2 border-emerald-100 bg-emerald-50 dark:bg-emerald-950/20 text-center space-y-4 animate-in fade-in zoom-in duration-300 ${className}`}>
        <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400">Thank You!</h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-500 max-w-[280px] mx-auto">
          Your message has been received. Our team will contact you shortly.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setSubmitted(false)}
          className="border-emerald-200 hover:bg-emerald-100 text-emerald-700"
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl border border-border shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${className}`}>
      {/* Header */}
      <div className="bg-primary/5 p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground text-center">{title}</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="pl-10 bg-muted/30 border-muted focus:bg-background transition-all"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="pl-10 bg-muted/30 border-muted focus:bg-background transition-all"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Phone Number</label>
          <div className="relative group">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="pl-10 bg-muted/30 border-muted focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Message</label>
          <div className="relative group">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="pl-10 min-h-[100px] resize-none bg-muted/30 border-muted focus:bg-background transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-11 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all font-bold group"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Send Enquiry
            </>
          )}
        </Button>

        <p className="text-[10px] text-center text-muted-foreground leading-tight px-4">
          By submitting this form, you agree to our terms of service and privacy policy.
        </p>
      </form>
    </div>
  );
};

export default LeadForm;
