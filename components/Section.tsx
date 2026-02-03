
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = "", id }) => (
  <section id={id} className={`py-20 px-4 md:px-8 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);
