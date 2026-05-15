const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Buildify helped us launch PPC pages directly on client websites without involving developers.",
      author: "Marcus Thorne",
      role: "Growth Lead, AdFlow",
      color: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      quote: "The AI-generated layouts are surprisingly conversion-focused and save our team hours.",
      author: "Elena Rodriguez",
      role: "PPC Specialist",
      color: "bg-pink-100",
      textColor: "text-pink-600"
    },
    {
      quote: "We replaced multiple tools because Buildify lets us publish directly on our domains.",
      author: "Sam Peterson",
      role: "Agency Founder",
      color: "bg-orange-100",
      textColor: "text-orange-600"
    }
  ];

  return (
    <section className="py-24 bg-[#f7f4ef]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl font-bold text-center text-black mb-20">Trusted by Agencies & Growth Teams</h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-10 shadow-sm flex flex-col justify-between">
              <p className="text-xl italic text-black/80 leading-relaxed mb-12">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full ${t.color} flex items-center justify-center ${t.textColor} font-bold text-xs uppercase`}>
                  {t.author[0]}
                </div>
                <div>
                  <h4 className="font-bold text-black">{t.author}</h4>
                  <p className="text-black/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
