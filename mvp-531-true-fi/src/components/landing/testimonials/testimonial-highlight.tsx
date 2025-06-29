const TestimonialHighlight = () => {
  return (
    <>
      <section id="testimonial-highlight">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20">
          <figure>
            <blockquote>
              <p className="mb-10 text-accent-foreground text-xl text-center font-semibold sm:text-2xl italic group-hover:-translate-y-1 transition-all duration-300 ease-in-out">
                “TrueFi takes the stress out of managing my money. It’s like having a financial advisor in my pocket, anytime I need it.”
              </p>
              <p className="text-accent-foreground text-xl text-center font-semibold sm:text-2xl italic group-hover:-translate-y-1 transition-all duration-300 ease-in-out">
                “I didn’t grow up learning about money. TrueFi helps me track my spending, build savings, and actually understand what’s going on with my finances, all without judgment.”
              </p>
            </blockquote>
          </figure>
        </div>
      </section>
    </>
  );
};

export default TestimonialHighlight;
