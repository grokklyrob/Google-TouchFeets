
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="py-8 mt-16 px-4 border-t border-red-900/50 bg-black">
            <div className="container mx-auto text-center text-gray-500">
                <p className="font-gothic text-lg text-red-500/70">Touch Feets</p>
                <p className="text-sm mt-2">
                    &copy; {new Date().getFullYear()} Touch Feets. A divine experiment in art and technology.
                </p>
                <p className="text-xs mt-4">
                    All generated images contain an invisible SynthID watermark as per Google's policy. Please use this service reverently and responsibly.
                </p>
            </div>
        </footer>
    );
};
