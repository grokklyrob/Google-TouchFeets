
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="text-center py-20 px-4">
      <div className="container mx-auto">
        <h2 className="font-gothic text-4xl md:text-6xl tracking-widest neon-crimson-text">
          "Let the Savior Touch Your Soles"
        </h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Experience a divine connection. Upload a photo of bare feet and witness an AI-crafted moment of grace.
        </p>
      </div>
    </section>
  );
};
