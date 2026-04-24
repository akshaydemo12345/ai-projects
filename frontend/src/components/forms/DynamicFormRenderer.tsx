import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export interface FormField {
  field_name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options?: string[];
  validation?: {
    pattern?: string;
    message?: string;
    min?: number;
    max?: number;
  };
}

interface DynamicFormRendererProps {
  fields: FormField[];
  projectId: string;
  pageSlug: string;
  onSuccess?: () => void;
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ 
  fields, 
  projectId, 
  pageSlug,
  onSuccess 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectId,
          pageSlug,
          domain: window.location.hostname,
          url: window.location.href
        })
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          toast.error(result.message || 'Failed to submit form');
        }
      } else {
        toast.success('Thank you! Your submission has been received.');
        setFormData({});
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          <ul className="list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {fields.map((field) => (
        <div key={field.field_name} className="space-y-2">
          <Label htmlFor={field.field_name} className="text-sm font-medium">
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>

          {field.type === 'textarea' ? (
            <Textarea
              id={field.field_name}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.field_name] || ''}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              className="resize-none"
            />
          ) : field.type === 'select' ? (
            <Select 
              onValueChange={(val) => handleChange(field.field_name, val)}
              value={formData[field.field_name] || ''}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={field.field_name}
              type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.field_name] || ''}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
            />
          )}
        </div>
      ))}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
      </Button>
    </form>
  );
};
